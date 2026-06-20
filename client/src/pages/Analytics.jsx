import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { FaChartLine, FaCheckCircle, FaFire, FaPercentage, FaTrophy } from "react-icons/fa";

import MainLayout from "../components/layout/MainLayout";
import PageHeader from "../components/ui/PageHeader";
import StatsCard from "../components/ui/StatsCard";
import SectionTitle from "../components/ui/SectionTitle";
import FadeIn from "../components/ui/FadeIn";

import { useTheme } from "../context/ThemeContext";
import API from "../api/axios";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Analytics() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [range, setRange] = useState(7); // 7 or 30

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const res = await API.get("/habits");
      return res.data;
    },
  });

  const habits = apiResponse?.habits || [];

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: isDark ? "#18181b" : "#ffffff",
      borderColor: isDark ? "#3f3f46" : "#ddd6fe",
      borderRadius: "10px",
      color: isDark ? "#f4f4f5" : "#1e1b4b",
      fontSize: "12px",
    },
  };

  // ── Trend data (7 or 30 days) ──
  const trendData = useMemo(() => {
    const days = [];
    for (let i = range - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-CA");
      const label = range === 7
        ? d.toLocaleDateString("en-US", { weekday: "short" })
        : d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
      const count = habits.reduce((acc, h) => acc + (h.completedDates?.includes(dateStr) ? 1 : 0), 0);
      days.push({ name: label, Completions: count });
    }
    return days;
  }, [habits, range]);

  // ── Category distribution ──
  const categoryData = useMemo(() => {
    const counts = {};
    habits.forEach(h => {
      const cat = h.category || "General";
      counts[cat] = (counts[cat] || 0) + (h.completedDates?.length || 0);
    });
    return Object.keys(counts).map(k => ({ name: k, Checks: counts[k] }));
  }, [habits]);

  // ── Best day of week (across all-time completions) ──
  const dayOfWeekData = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0, 0]; // Sun..Sat
    habits.forEach(h => {
      (h.completedDates || []).forEach(dateStr => {
        const d = new Date(dateStr + "T00:00:00");
        counts[d.getDay()]++;
      });
    });
    const max = Math.max(...counts);
    return DAY_NAMES.map((name, i) => ({
      name,
      Completions: counts[i],
      isBest: counts[i] === max && max > 0,
    }));
  }, [habits]);

  const bestDay = useMemo(() => {
    if (dayOfWeekData.every(d => d.Completions === 0)) return "—";
    return dayOfWeekData.reduce((a, b) => (b.Completions > a.Completions ? b : a)).name;
  }, [dayOfWeekData]);

  // ── Stats ──
  const todayStr = new Date().toLocaleDateString("en-CA");
  const totalCheckins = habits.reduce((a, h) => a + (h.completedDates?.length || 0), 0);
  const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.longestStreak || 0)) : 0;
  const doneToday = habits.filter(h => h.completedDates?.includes(todayStr)).length;
  const rate = habits.length > 0 ? `${Math.round((doneToday / habits.length) * 100)}%` : "0%";

  const cardClass = `rounded-2xl border p-4 sm:p-6 ${
    isDark ? "bg-zinc-900 border-zinc-800" : "bg-white/80 border-violet-200 shadow-sm backdrop-blur-sm"
  }`;

  return (
    <MainLayout>
      <FadeIn>
        <div className="space-y-6">
          <PageHeader title="Analytics" subtitle="Performance metrics and trend insights for your habits." />

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatsCard title="Total Check-ins" value={isLoading ? "—" : totalCheckins} icon={<FaCheckCircle />} iconClassName="bg-violet-500/10 border-violet-500/20 text-violet-400" />
            <StatsCard title="Best Streak" value={isLoading ? "—" : `${bestStreak}d`} icon={<FaFire />} iconClassName="bg-amber-500/10 border-amber-500/20 text-amber-400" />
            <StatsCard title="Today's Rate" value={isLoading ? "—" : rate} icon={<FaPercentage />} iconClassName="bg-emerald-500/10 border-emerald-500/20 text-emerald-400" />
            <StatsCard title="Best Day" value={isLoading ? "—" : bestDay} icon={<FaTrophy />} iconClassName="bg-blue-500/10 border-blue-500/20 text-blue-400" />
          </div>

          {/* Trend chart with 7d/30d toggle */}
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
              <SectionTitle>Performance Trend</SectionTitle>

              {/* Range toggle */}
              <div className={`flex items-center rounded-lg p-1 border ${isDark ? "bg-zinc-950 border-zinc-800" : "bg-violet-50 border-violet-200"}`}>
                {[7, 30].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      range === r
                        ? "bg-violet-600 text-white shadow-sm"
                        : isDark
                          ? "text-zinc-500 hover:text-zinc-300"
                          : "text-violet-400 hover:text-violet-600"
                    }`}
                  >
                    {r}D
                  </button>
                ))}
              </div>
            </div>

            <div className="h-56 sm:h-64 mt-3">
              {isLoading ? (
                <div className={`w-full h-full rounded-xl animate-pulse ${isDark ? "bg-zinc-800/40" : "bg-violet-100"}`} />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#27272a" : "#ede9fe"} />
                    <XAxis
                      dataKey="name"
                      stroke={isDark ? "#52525b" : "#a78bfa"}
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      interval={range === 30 ? 3 : 0}
                    />
                    <YAxis stroke={isDark ? "#52525b" : "#a78bfa"} fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip {...tooltipStyle} />
                    <Line
                      type="monotone"
                      dataKey="Completions"
                      stroke="#8b5cf6"
                      strokeWidth={2.5}
                      dot={range === 7 ? { fill: "#8b5cf6", r: 4, strokeWidth: 0 } : false}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Best Day of Week + Category side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

            {/* Best day of week */}
            <div className={cardClass}>
              <SectionTitle>Best Day of the Week</SectionTitle>
              <p className={`text-xs mb-3 -mt-1 ${isDark ? "text-zinc-600" : "text-violet-400"}`}>
                All-time completions grouped by weekday
              </p>
              <div className="h-52 sm:h-64">
                {isLoading ? (
                  <div className={`w-full h-full rounded-xl animate-pulse ${isDark ? "bg-zinc-800/40" : "bg-violet-100"}`} />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dayOfWeekData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#27272a" : "#ede9fe"} />
                      <XAxis dataKey="name" stroke={isDark ? "#52525b" : "#a78bfa"} fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke={isDark ? "#52525b" : "#a78bfa"} fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip {...tooltipStyle} />
                      <Bar dataKey="Completions" radius={[6, 6, 0, 0]}>
                        {dayOfWeekData.map((entry, i) => (
                          <Cell key={i} fill={entry.isBest ? "#f59e0b" : "#8b5cf6"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Category distribution */}
            <div className={cardClass}>
              <SectionTitle>Category Distribution</SectionTitle>
              <p className={`text-xs mb-3 -mt-1 ${isDark ? "text-zinc-600" : "text-violet-400"}`}>
                Total check-ins by category
              </p>
              <div className="h-52 sm:h-64">
                {isLoading ? (
                  <div className={`w-full h-full rounded-xl animate-pulse ${isDark ? "bg-zinc-800/40" : "bg-violet-100"}`} />
                ) : categoryData.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm">
                    No data yet.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#27272a" : "#ede9fe"} />
                      <XAxis dataKey="name" stroke={isDark ? "#52525b" : "#a78bfa"} fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke={isDark ? "#52525b" : "#a78bfa"} fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip {...tooltipStyle} />
                      <Bar dataKey="Checks" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

          </div>
        </div>
      </FadeIn>
    </MainLayout>
  );
}

export default Analytics;