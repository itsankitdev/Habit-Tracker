import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaTimes, FaTrash } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

function ConfirmModal({ isOpen, onConfirm, onCancel, habitName }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCancel}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-sm rounded-2xl border p-6 shadow-2xl shadow-black/40 ${
                isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                  <FaExclamationTriangle className="text-lg" />
                </div>
                <button
                  onClick={onCancel}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>

              <h3 className={`text-base font-bold mb-1 ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                Delete Habit
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Are you sure you want to delete{" "}
                <span className={`font-semibold capitalize ${isDark ? "text-zinc-200" : "text-zinc-700"}`}>
                  "{habitName}"
                </span>? This cannot be undone.
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={onCancel}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isDark
                      ? "text-zinc-400 bg-zinc-800 hover:bg-zinc-700 hover:text-zinc-200"
                      : "text-zinc-600 bg-zinc-100 hover:bg-zinc-200"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all duration-200 cursor-pointer"
                >
                  <FaTrash className="text-xs" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ConfirmModal;