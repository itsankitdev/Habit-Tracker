import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

const ToastContext = createContext();

const ICONS = {
  success: <FaCheckCircle className="text-emerald-400 text-base shrink-0" />,
  error: <FaExclamationCircle className="text-red-400 text-base shrink-0" />,
  info: <FaInfoCircle className="text-blue-400 text-base shrink-0" />,
};

const STYLES = {
  success: "bg-zinc-900 dark:bg-zinc-900 border-emerald-500/30",
  error:   "bg-zinc-900 dark:bg-zinc-900 border-red-500/30",
  info:    "bg-zinc-900 dark:bg-zinc-900 border-blue-500/30",
};

function ToastItem({ toast, onRemove }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-xl shadow-black/30 min-w-[260px] max-w-sm ${STYLES[toast.type]}`}
    >
      {ICONS[toast.type]}
      <p className="text-sm font-medium text-zinc-100 flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-zinc-600 hover:text-zinc-300 transition-colors shrink-0 mt-0.5 cursor-pointer"
      >
        <FaTimes className="text-xs" />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast container — bottom right */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 items-end">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);