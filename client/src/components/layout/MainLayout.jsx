import Sidebar from "./Sidebar";
import { useTheme } from "../../context/ThemeContext";

function MainLayout({ children }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen flex ${isDark ? "bg-zinc-950 text-zinc-100" : "text-indigo-950"}`}
      style={!isDark ? {
        background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 40%, #faf5ff 100%)",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      } : {}}
    >
      <Sidebar />
      <div className="flex-1 min-w-0 h-screen overflow-y-auto custom-scrollbar">
        <main className="w-full max-w-6xl mx-auto px-4 pt-20 pb-8 sm:px-6 lg:pt-10 lg:pb-10 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;