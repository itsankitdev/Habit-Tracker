import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaChevronDown } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import Input from "./Input";
import Button from "./Button";

const CATEGORIES = ["Personal", "Health", "Career", "Learning", "Fitness", "Finance", "Mindfulness"];

const COLORS = [
  { label: "Violet",  value: "#8b5cf6" },
  { label: "Blue",    value: "#3b82f6" },
  { label: "Emerald", value: "#10b981" },
  { label: "Amber",   value: "#f59e0b" },
  { label: "Rose",    value: "#f43f5e" },
  { label: "Cyan",    value: "#06b6d4" },
  { label: "Orange",  value: "#f97316" },
  { label: "Pink",    value: "#ec4899" },
];

function EditHabitModal({ isOpen, habit, onSave, onClose, isLoading }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Personal");
  const [color, setColor] = useState(COLORS[0].value);
  const [error, setError] = useState("");

  // Pre-fill form when habit changes
  useEffect(() => {
    if (habit) {
      setName(habit.name || "");
      setCategory(habit.category || "Personal");
      setColor(habit.color || COLORS[0].value);
      setError("");
    }
  }, [habit]);

  const handleSave = () => {
    if (!name.trim()) {
      setError("Habit name cannot be empty.");
      return;
    }
    onSave({ name: name.trim(), category, color });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 20 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl shadow-black/40 ${
                isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className={`text-base font-bold ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                    Edit Habit
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Update your habit details</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>

              <div className={`border-t mb-5 ${isDark ? "border-zinc-800" : "border-zinc-100"}`} />

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <Input
                    label="Habit Name"
                    placeholder="e.g., Drink 3L Water"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(""); }}
                  />
                  {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`w-full h-11 rounded-xl border px-4 pr-10 text-sm appearance-none outline-none transition-all duration-200 cursor-pointer
                        focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                        ${isDark
                          ? "bg-zinc-900 border-zinc-800 text-zinc-100"
                          : "bg-white border-zinc-300 text-zinc-900"
                        }`}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs pointer-events-none" />
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setColor(c.value)}
                        title={c.label}
                        className="w-7 h-7 rounded-lg transition-all duration-150 cursor-pointer"
                        style={{
                          background: c.value,
                          boxShadow: color === c.value
                            ? `0 0 0 2px ${isDark ? "#18181b" : "#fff"}, 0 0 0 4px ${c.value}`
                            : "none",
                          transform: color === c.value ? "scale(1.2)" : "scale(1)",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className={`flex items-center gap-3 p-3 rounded-xl border ${isDark ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200"}`}>
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ background: color, boxShadow: `0 0 6px ${color}60` }}
                  />
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                    style={{ background: `${color}18`, color }}
                  >
                    {category}
                  </span>
                  <span className={`text-sm font-semibold capitalize truncate ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                    {name || "Habit name preview"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={onClose}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isDark
                      ? "text-zinc-400 bg-zinc-800 hover:bg-zinc-700 hover:text-zinc-200"
                      : "text-zinc-600 bg-zinc-100 hover:bg-zinc-200"
                  }`}
                >
                  Cancel
                </button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 h-10"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default EditHabitModal;