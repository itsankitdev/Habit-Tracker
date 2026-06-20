import { useTheme } from "../../context/ThemeContext";

function PageHeader({ title, subtitle }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`border-b pb-5 mb-6 ${isDark ? "border-zinc-800" : "border-violet-200"}`}>
      <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? "text-zinc-100" : "text-indigo-950"}`}>
        {title}
      </h1>
      {subtitle && (
        <p className={`text-sm mt-1 ${isDark ? "text-zinc-500" : "text-violet-500"}`}>{subtitle}</p>
      )}
    </div>
  );
}

export default PageHeader;