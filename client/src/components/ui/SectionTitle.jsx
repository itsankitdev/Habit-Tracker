import { useTheme } from "../../context/ThemeContext";

function SectionTitle({ children }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? "text-zinc-500" : "text-violet-500"}`}>
      {children}
    </p>
  );
}

export default SectionTitle;