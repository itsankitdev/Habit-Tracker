import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { FaEnvelope, FaSignOutAlt, FaCamera } from "react-icons/fa";

import MainLayout from "../components/layout/MainLayout";
import PageHeader from "../components/ui/PageHeader";
import SectionTitle from "../components/ui/SectionTitle";
import FadeIn from "../components/ui/FadeIn";

import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { getUser, updateUser, clearUser } from "../utils/auth";

function Settings() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { addToast } = useToast();
  const isDark = theme === "dark";

  const user = getUser() || { name: "User", email: "" };
  const [avatar, setAvatar] = useState(user.avatar || null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "HT";

  // Handle avatar file select — convert to base64 and save locally
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      addToast("Please select an image file.", "error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      addToast("Image must be under 2MB.", "error");
      return;
    }

    setIsUploadingAvatar(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setAvatar(base64);
      updateUser({ avatar: base64 });
      addToast("Profile picture updated! 🖼️", "success");
      setIsUploadingAvatar(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    updateUser({ avatar: null });
    addToast("Profile picture removed.", "info");
  };

  const handleLogout = () => {
    clearUser();
    navigate("/");
  };

  const rowClass = `flex items-center gap-4 p-4 rounded-xl border ${
    isDark ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200"
  }`;

  const cardClass = `rounded-2xl border p-5 sm:p-6 space-y-4 ${
    isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
  }`;

  return (
    <MainLayout>
      <FadeIn>
        <div className="space-y-6 max-w-2xl">
          <PageHeader title="Account Settings" subtitle="Manage your profile and secure your session." />

          {/* ── Profile Card ── */}
          <div className={cardClass}>
            <SectionTitle>User Profile</SectionTitle>

            {/* Avatar Section */}
            <div className={`flex items-center gap-5 p-4 rounded-xl border ${isDark ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200"}`}>
              {/* Avatar circle */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-violet-500/40">
                  {avatar ? (
                    <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-violet-600/20 flex items-center justify-center">
                      <span className="text-xl font-bold text-violet-400">{initials}</span>
                    </div>
                  )}
                </div>

                {/* Camera overlay */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-violet-600 border-2 border-zinc-900 flex items-center justify-center text-white hover:bg-violet-500 transition-colors cursor-pointer shadow-lg"
                  title="Upload photo"
                >
                  <FaCamera className="text-[10px]" />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <div className="min-w-0">
                <p className={`text-sm font-bold capitalize ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                  {user.name}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">{user.email}</p>
                <div className="flex items-center gap-2 mt-2.5">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors cursor-pointer"
                  >
                    {avatar ? "Change photo" : "Upload photo"}
                  </button>
                  {avatar && (
                    <>
                      <span className="text-zinc-700">·</span>
                      <button
                        onClick={handleRemoveAvatar}
                        className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
                <p className="text-[10px] text-zinc-600 mt-1">JPG, PNG up to 2MB</p>
              </div>
            </div>

            {/* Name row */}
            <div className={rowClass}>
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                {avatar ? (
                  <img src={avatar} alt="" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span className="text-xs font-bold">{initials}</span>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Full Name</p>
                <p className={`text-sm sm:text-base font-semibold mt-0.5 capitalize ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                  {user.name}
                </p>
              </div>
            </div>

            {/* Email row */}
            <div className={rowClass}>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <FaEnvelope className="text-base" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email Address</p>
                <p className={`text-sm sm:text-base font-semibold mt-0.5 truncate ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* ── Security Card ── */}
          <div className={cardClass}>
            <SectionTitle>System Security</SectionTitle>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Your session is secured with JWT authentication. Click below to clear your local session and sign out safely.
            </p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 font-semibold text-sm cursor-pointer"
            >
              <FaSignOutAlt />
              Log Out of Session
            </button>
          </div>
        </div>
      </FadeIn>
    </MainLayout>
  );
}

export default Settings;