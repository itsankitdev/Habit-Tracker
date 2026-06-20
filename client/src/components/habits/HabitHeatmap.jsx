import { useTheme } from "../../context/ThemeContext";

function HabitHeatmap({ completedDates = [], color = "#8b5cf6" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const getLast30Days = () => {
    const dates = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toLocaleDateString("en-CA"));
    }
    return dates;
  };

  const last30Days = getLast30Days();

  return (
    <div className={`mt-3 pt-3 border-t ${isDark ? "border-zinc-800" : "border-zinc-100"}`}>
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
        Last 30 days
      </p>
      <div className="flex flex-wrap gap-1">
        {last30Days.map((dateStr) => {
          const isCompleted = completedDates.includes(dateStr);
          const d = new Date(dateStr + "T00:00:00");
          const tooltip = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

          return (
            <div
              key={dateStr}
              title={`${tooltip}: ${isCompleted ? "✓ Done" : "Not done"}`}
              className="w-3 h-3 rounded-sm cursor-pointer transition-transform duration-100 hover:scale-125"
              style={{
                background: isCompleted ? color : isDark ? "#27272a" : "#e4e4e7",
                boxShadow: isCompleted ? `0 0 4px ${color}50` : "none",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default HabitHeatmap;