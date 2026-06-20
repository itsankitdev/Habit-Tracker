import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import habitRoutes from "./routes/habitRoutes.js"; // <-- Import habit routes

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Mount API Routes
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes); // <-- Link habit routes here

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Habit Tracker API Running with ES Modules",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`⚡ Server running on port ${PORT}`);
});