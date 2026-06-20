import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  FaCheck, FaFire, FaCheckCircle, FaChartLine,
  FaPercentage, FaListUl, FaPlus, FaChevronDown
} from "react-icons/fa";

import MainLayout from "../components/layout/MainLayout";
import PageHeader from "../components/ui/PageHeader";
import StatsCard from "../components/ui/StatsCard";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import SectionTitle from "../components/ui/SectionTitle";
import FadeIn from "../components/ui/FadeIn";
import HabitHeatmap from "../components/habits/HabitHeatmap";

import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import API from "../api/axios";

// ── Constants ─────────────────────────────────────────────────
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

// ── Color Picker ──────────────────────────────────────────────
function ColorPicker({ selected, onChange }) {
  return (
    <div>
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
        Color
      </label>
      <div className="flex flex-wrap gap-2">
        {COLORS.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => onChange(c.value)}
            title={c.label}
            className="w-7 h-7 rounded-lg transition-all duration-150 cursor-pointer"
            style={{
              background: c.value,
              boxShadow: selected === c.value ? `0 0 0 2px #fff, 0 0 0 4px ${c.value}` : "none",
              transform: selected === c.value ? "scale(1.15)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Category Select ───────────────────────────────────────────
function CategorySelect({ value, onChange, isDark }) {
  return (
    <div>
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
        Category
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
  );
}

// ── Dashboard ─────────────────────────────────────────────────
function Dashboard() {
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const { addToast } = useToast();
  const isDark = theme === "dark";

  const todayStr = new Date().toLocaleDateString("en-CA");

  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [selectedCategory, setSelectedCategory] = useState("Personal");

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const res = await API.get("/habits");
      return res.data;
    },
  });

  const habits = apiResponse?.habits || [];

  // Create habit
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const res = await API.post("/habits", data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["habits"]);
      reset();
      setSelectedColor(COLORS[0].value);
      setSelectedCategory("Personal");
      addToast(`"${variables.name}" habit created! 🎯`, "success");
    },
    onError: (err) => {
      addToast(err.response?.data?.message || "Failed to create habit.", "error");
    },
  });

  // Toggle completion
  const toggleMutation = useMutation({
    mutationFn: async (habitId) => {
      const res = await API.post(`/habits/${habitId}/toggle`, { date: todayStr });
      return res.data;
    },
    onSuccess: (data, habitId) => {
      queryClient.invalidateQueries(["habits"]);
      const habit = habits.find((h) => h._id === habitId);
      const isNowDone = !habit?.completedDates?.includes(todayStr);
      if (isNowDone) addToast(`${habit?.name} completed today! ✅`, "success");
    },
  });

  const onSubmit = (data) => {
    createMutation.mutate({
      name: data.habitName,
      category: selectedCategory,
      color: selectedColor,
    });
  };

  const completedToday = habits.filter((h) => h.completedDates.includes(todayStr)).length;
  const bestStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.currentStreak || 0)) : 0;
  const successRate = habits.length > 0
    ? `${Math.round((completedToday / habits.length) * 100)}%`
    : "0%";

  return (
    <MainLayout>
      <FadeIn>
        <div className="space-y-6">
          <PageHeader title="Dashboard" subtitle="Track your habits and build consistency every day." />

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatsCard title="Total Habits"  value={isLoading ? "—" : habits.length}    icon={<FaListUl />}      iconClassName="bg-blue-500/10 border-blue-500/20 text-blue-400" />
            <StatsCard title="Done Today"    value={isLoading ? "—" : completedToday}   icon={<FaCheckCircle />} iconClassName="bg-violet-500/10 border-violet-500/20 text-violet-400" />
            <StatsCard title="Best Streak"   value={isLoading ? "—" : `${bestStreak}d`} icon={<FaFire />}        iconClassName="bg-amber-500/10 border-amber-500/20 text-amber-400" />
            <StatsCard title="Success Rate"  value={isLoading ? "—" : successRate}      icon={<FaPercentage />}  iconClassName="bg-emerald-500/10 border-emerald-500/20 text-emerald-400" />
          </div>

          {/* Quick Add Form */}
          <Card className="p-5 sm:p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <SectionTitle>Quick Add Habit</SectionTitle>

              {/* Name + submit row */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                <div className="flex-1">
                  <Input
                    label="Habit Name"
                    placeholder="e.g., Drink 3L Water, Meditate, Code 1 hour"
                    {...register("habitName", { required: "Habit name cannot be empty" })}
                  />
                </div>
                <Button type="submit" disabled={createMutation.isPending} className="w-full sm:w-auto h-11 px-6">
                  <FaPlus className="text-xs" />
                  {createMutation.isPending ? "Adding..." : "Create Habit"}
                </Button>
              </div>

              {errors.habitName && (
                <p className="text-xs text-red-400">{errors.habitName.message}</p>
              )}

              {/* Category + Color row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <CategorySelect
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  isDark={isDark}
                />
                <ColorPicker selected={selectedColor} onChange={setSelectedColor} />
              </div>
            </form>
          </Card>

          {/* Habits Grid */}
          <div className="space-y-3">
            <SectionTitle>Your Habits</SectionTitle>

            {isLoading && (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`h-28 rounded-2xl border ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-zinc-100 border-zinc-200"}`} />
                ))}
              </div>
            )}

            {!isLoading && habits.length === 0 && (
              <div className={`p-10 text-center rounded-2xl border ${isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-zinc-50 border-zinc-200"}`}>
                <FaCheckCircle className="text-3xl text-zinc-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-zinc-400">No habits yet</p>
                <p className="text-xs text-zinc-500 mt-1">Use the form above to add your first habit.</p>
              </div>
            )}

            {!isLoading && habits.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {habits.map((habit) => {
                  const done = habit.completedDates.includes(todayStr);
                  const color = habit.color || "#8b5cf6";

                  return (
                    <div
                      key={habit._id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                        isDark
                          ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                          : "bg-white border-zinc-200 hover:border-zinc-300 shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          {/* Color dot */}
                          <div
                            className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                            style={{ background: color, boxShadow: `0 0 6px ${color}60` }}
                          />
                          <div className="min-w-0">
                            {/* Category badge */}
                            <span
                              className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 uppercase tracking-wider"
                              style={{ background: `${color}18`, color: color }}
                            >
                              {habit.category || "Personal"}
                            </span>
                            <h4 className={`text-sm sm:text-base font-semibold capitalize truncate transition-all ${
                              done
                                ? "line-through text-zinc-500"
                                : isDark ? "text-zinc-100" : "text-zinc-900"
                            }`}>
                              {habit.name}
                            </h4>
                            <div className="flex items-center gap-1.5 text-amber-500 mt-0.5">
                              <FaFire className="text-xs" />
                              <span className="text-xs font-medium">{habit.currentStreak || 0} day streak</span>
                            </div>
                          </div>
                        </div>

                        {/* Toggle button */}
                        <button
                          onClick={() => toggleMutation.mutate(habit._id)}
                          className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0"
                          style={done ? {
                            background: color,
                            borderColor: color,
                            color: "white",
                            boxShadow: `0 4px 12px ${color}40`,
                          } : {
                            background: "transparent",
                            borderColor: isDark ? "#3f3f46" : "#d4d4d8",
                            color: isDark ? "#52525b" : "#a1a1aa",
                          }}
                        >
                          <FaCheck className="text-xs" />
                        </button>
                      </div>

                      <HabitHeatmap completedDates={habit.completedDates} color={color} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </FadeIn>
    </MainLayout>
  );
}

export default Dashboard;