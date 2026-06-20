import express from "express";
import { 
  createHabit, 
  getHabits, 
  getHabitById, 
  updateHabit, 
  deleteHabit,
  toggleHabitCompletion // <-- Import toggle controller
} from "../controllers/habitController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, createHabit)
  .get(protect, getHabits);

router.route("/:id")
  .get(protect, getHabitById)
  .put(protect, updateHabit)
  .delete(protect, deleteHabit);

// Custom Action Route: /api/habits/:id/toggle
router.post("/:id/toggle", protect, toggleHabitCompletion); // <-- Wire up the toggle path

export default router;