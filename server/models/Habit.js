import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Habit name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    color: {
      type: String,
      default: "#8B5CF6", // Default violet theme color
    },
    weeklyGoal: {
      type: Number,
      default: 7,
      min: 1,
      max: 7,
    },
    // Array of string dates storing completed days formatted as "YYYY-MM-DD"
    completedDates: {
      type: [String],
      default: [],
    },
    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically tracks when a habit was created or updated
  },
);

// Optimize database querying by indexing habits matching a specific user ID
habitSchema.index({ user: 1 });

const Habit = mongoose.model("Habit", habitSchema);
export default Habit;
