import Habit from "../models/Habit.js";

// @desc    Create a new habit
// @route   POST /api/habits
// @access  Private (Requires a verified JWT)
export const createHabit = async (req, res) => {
  try {
    const { name, description, category, color } = req.body;

    // 1. Enforce validation on the name field
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Habit name is required",
      });
    }

    // 2. Instantiate and save the new habit, embedding the authenticated user's ID
    // Remember: req.user was injected into the request object by our protect middleware!
    const habit = await Habit.create({
      user: req.user.id, 
      name,
      description,
      category,
      color,
    });

    res.status(201).json({
      success: true,
      message: "Habit created successfully",
      habit,
    });
  } catch (error) {
    console.error(`❌ Error creating habit: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server error. Could not create habit.",
    });
  }
};

// @desc    Get all active habits for logged-in user
// @route   GET /api/habits
// @access  Private
export const getHabits = async (req, res) => {
  try {
    // Find all habits belonging to this user where isArchived is false
    // Sort by newest created habit first
    const habits = await Habit.find({ user: req.user.id, isArchived: false })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: habits.length,
      habits,
    });
  } catch (error) {
    console.error(`❌ Error fetching habits: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server error. Could not retrieve habits.",
    });
  }
};

// @desc    Get a single habit by ID
// @route   GET /api/habits/:id
// @access  Private
export const getHabitById = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    // 1. Check if the habit exists in the database
    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found",
      });
    }

    // 2. Security Check: Ensure the logged-in user owns this habit!
    // We convert the MongoDB ObjectId to a string before comparing
    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this habit",
      });
    }

    res.json({
      success: true,
      habit,
    });
  } catch (error) {
    console.error(`❌ Error fetching habit details: ${error.message}`);
    
    // If the user sends a malformed MongoDB ID string, catch it elegantly
    if (error.kind === "ObjectId") {
      return res.status(400).json({ success: false, message: "Invalid Habit ID format" });
    }
    
    res.status(500).json({
      success: false,
      message: "Server error. Could not retrieve habit details.",
    });
  }
};

// @desc    Update a habit
// @route   PUT /api/habits/:id
// @access  Private
export const updateHabit = async (req, res) => {
  try {
    const { name, description, category, color, isArchived } = req.body;

    // 1. Fetch the habit from the database
    let habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ success: false, message: "Habit not found" });
    }

    // 2. Access Control: Ensure the logged-in user owns this habit
    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized to update this habit" });
    }

    // 3. Update fields conditionally using MongoDB's $set style updates
    habit.name = name || habit.name;
    habit.description = description !== undefined ? description : habit.description;
    habit.category = category || habit.category;
    habit.color = color || habit.color;
    habit.isArchived = isArchived !== undefined ? isArchived : habit.isArchived;

    // 4. Save the updated document back to MongoDB
    const updatedHabit = await habit.save();

    res.json({
      success: true,
      message: "Habit updated successfully",
      habit: updatedHabit,
    });
  } catch (error) {
    console.error(`❌ Error updating habit: ${error.message}`);
    res.status(500).json({ success: false, message: "Server error. Could not update habit." });
  }
};

// @desc    Delete a habit permanently
// @route   DELETE /api/habits/:id
// @access  Private
export const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ success: false, message: "Habit not found" });
    }

    // 1. Access Control: Ensure the logged-in user owns this habit
    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this habit" });
    }

    // 2. Perform a permanent deletion from the collection
    await habit.deleteOne();

    res.json({
      success: true,
      message: "Habit deleted permanently from database",
    });
  } catch (error) {
    console.error(`❌ Error deleting habit: ${error.message}`);
    res.status(500).json({ success: false, message: "Server error. Could not delete habit." });
  }
};

// @desc    Toggle habit completion status for a specific date
// @route   POST /api/habits/:id/toggle
// @access  Private
export const toggleHabitCompletion = async (req, res) => {
  try {
    const { date } = req.body;
    const targetDate = date || new Date().toISOString().split("T")[0];

    const habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ success: false, message: "Habit not found" });
    }
    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const dateIndex = habit.completedDates.indexOf(targetDate);

    if (dateIndex > -1) {
      habit.completedDates.splice(dateIndex, 1);
    } else {
      habit.completedDates.push(targetDate);
    }

    // 🔥 ADVANCED CALCULATION ENGINE START
    // 1. Clean up array: Remove duplicates and sort chronologically
    let uniqueDates = [...new Set(habit.completedDates)].sort();
    habit.completedDates = uniqueDates;

    // 2. Initialize calculation values
    let streak = 0;
    
    // Get today's date string in current system timezone environment
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    // Check if the habit has been completed either today or at least yesterday
    const hasCompletedRecently = uniqueDates.includes(today) || uniqueDates.includes(yesterday);

    if (hasCompletedRecently && uniqueDates.length > 0) {
      streak = 1; // Start counting from 1
      
      // Loop backwards through your completed entries to calculate consecutive gaps
      for (let i = uniqueDates.length - 1; i > 0; i--) {
        const currentEntry = new Date(uniqueDates[i]);
        const previousEntry = new Date(uniqueDates[i - 1]);
        
        // Calculate difference in hours between consecutive dates
        const diffTime = Math.abs(currentEntry - previousEntry);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          streak++; // Back-to-back day found! Up the streak.
        } else if (diffDays > 1) {
          break; // Streak broken! Stop tracking backward loop.
        }
      }
    } else {
      streak = 0; // No recent check-ins found, streak resets to 0
    }

    habit.currentStreak = streak;

    // Update longest milestone metric if current streak breaks the record
    if (habit.currentStreak > habit.longestStreak) {
      habit.longestStreak = habit.currentStreak;
    }
    // 🔥 ADVANCED CALCULATION ENGINE END

    const updatedHabit = await habit.save();

    res.json({
      success: true,
      message: dateIndex > -1 ? "Habit completion undone" : "Habit marked completed",
      currentStreak: updatedHabit.currentStreak,
      longestStreak: updatedHabit.longestStreak,
      completedDates: updatedHabit.completedDates,
    });

  } catch (error) {
    console.error(`❌ Error toggling habit: ${error.message}`);
    res.status(500).json({ success: false, message: "Server error." });
  }
};