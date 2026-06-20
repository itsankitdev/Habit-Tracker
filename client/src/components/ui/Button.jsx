import { motion } from "framer-motion";

function Button({ children, type = "button", onClick, className = "", disabled = false }) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`
        inline-flex items-center justify-center gap-2
        px-5 py-2.5
        rounded-xl
        text-sm font-semibold text-white
        bg-violet-600 hover:bg-violet-500
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-lg shadow-violet-900/20
        transition-colors duration-200
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}

export default Button;