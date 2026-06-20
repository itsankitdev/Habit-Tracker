import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTrash, FaCalendarAlt, FaCheckCircle, FaPen } from "react-icons/fa";
import { useState } from "react";

import MainLayout from "../components/layout/MainLayout";
import PageHeader from "../components/ui/PageHeader";
import SectionTitle from "../components/ui/SectionTitle";
import FadeIn from "../components/ui/FadeIn";
import ConfirmModal from "../components/ui/ConfirmModal";
import EditHabitModal from "../components/ui/EditHabitModal";

import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import API from "../api/axios";

function Habits() {
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const { addToast } = useToast();
  const isDark = theme === "dark";

  const [deleteModal, setDeleteModal] = useState({ open: false, habit: null });
  const [editModal, setEditModal] = useState({ open: false, habit: null });

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const res = await API.get("/habits");
      return res.data;
    },
  });

  const habits = apiResponse?.habits || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (habitId) => {
      const res = await API.delete(`/habits/${habitId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["habits"]);
      addToast(`"${deleteModal.habit?.name}" deleted.`, "info");
      setDeleteModal({ open: false, habit: null });
    },
    onError: (err) => {
      addToast(err.response?.data?.message || "Failed to delete.", "error");
      setDeleteModal({ open: false, habit: null });
    },
  });

  // Edit mutation
  const editMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await API.put(`/habits/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["habits"]);
      addToast(`Habit updated successfully! ✏️`, "success");
      setEditModal({ open: false, habit: null });
    },
    onError: (err) => {
      addToast(err.response?.data?.message || "Failed to update habit.", "error");
    },
  });

  const handleSaveEdit = (updatedData) => {
    editMutation.mutate({ id: editModal.habit._id, data: updatedData });
  };

  return (
    <MainLayout>
      <FadeIn>
        <div className="space-y-6">
          <PageHeader title="Manage Habits" subtitle="Review, organize, and manage your active routines." />

          <SectionTitle>All Habits</SectionTitle>

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-32 rounded-2xl border ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-zinc-100 border-zinc-200"}`} />
              ))}
            </div>
          )}

          {!isLoading && habits.length === 0 && (
            <div className={`p-10 text-center rounded-2xl border ${isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-zinc-50 border-zinc-200"}`}>
              <FaCheckCircle className="text-3xl text-zinc-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-zinc-400">No habits yet</p>
              <p className="text-xs text-zinc-500 mt-1">Head to Dashboard to create one!</p>
            </div>
          )}

          {!isLoading && habits.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {habits.map((habit) => {
                const color = habit.color || "#8b5cf6";
                return (
                  <div
                    key={habit._id}
                    className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-colors duration-200 ${
                      isDark
                        ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                        : "bg-white border-zinc-200 hover:border-zinc-300 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Color bar */}
                        <div
                          className="w-1 h-12 rounded-full shrink-0 mt-0.5"
                          style={{ background: color }}
                        />
                        <div className="min-w-0">
                          <span
                            className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 uppercase tracking-wider"
                            style={{ background: `${color}18`, color }}
                          >
                            {habit.category || "General"}
                          </span>
                          <h3 className={`text-base sm:text-lg font-bold capitalize truncate ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                            {habit.name}
                          </h3>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {habit.description || "No description provided."}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Edit */}
                        <button
                          onClick={() => setEditModal({ open: true, habit })}
                          className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                            isDark
                              ? "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-violet-400 hover:border-violet-500/30 hover:bg-violet-500/5"
                              : "bg-zinc-50 border-zinc-200 text-zinc-400 hover:text-violet-500 hover:border-violet-200 hover:bg-violet-50"
                          }`}
                          title="Edit habit"
                        >
                          <FaPen className="text-xs" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteModal({ open: true, habit })}
                          className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                            isDark
                              ? "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5"
                              : "bg-zinc-50 border-zinc-200 text-zinc-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50"
                          }`}
                          title="Delete habit"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </div>

                    <div className={`flex flex-wrap items-center gap-3 mt-4 pt-3 border-t text-xs text-zinc-500 ${isDark ? "border-zinc-800" : "border-zinc-100"}`}>
                      <div className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-[10px]" />
                        <span>Total checks: {habit.completedDates?.length || 0}</span>
                      </div>
                      <span>Max streak: {habit.longestStreak || 0} days</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </FadeIn>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        habitName={deleteModal.habit?.name || ""}
        onConfirm={() => deleteMutation.mutate(deleteModal.habit._id)}
        onCancel={() => setDeleteModal({ open: false, habit: null })}
      />

      {/* Edit Modal */}
      <EditHabitModal
        isOpen={editModal.open}
        habit={editModal.habit}
        onSave={handleSaveEdit}
        onClose={() => setEditModal({ open: false, habit: null })}
        isLoading={editMutation.isPending}
      />
    </MainLayout>
  );
}

export default Habits;