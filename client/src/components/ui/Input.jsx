import { useTheme } from "../../context/ThemeContext";

function Input({ label, type = "text", placeholder = "", value, onChange, ...rest }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-violet-500"}`}>
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
        className={`w-full h-11 rounded-xl border px-4 text-sm outline-none transition-all duration-200
          focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
          ${isDark
            ? "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600"
            : "bg-white border-violet-200 text-indigo-950 placeholder:text-violet-300 shadow-sm"
          }`}
      />
    </div>
  );
}

export default Input;