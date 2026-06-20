import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaFire, FaCheckCircle, FaChartBar, FaBolt, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import API from "../api/axios";

// ─── Auth Modal ───────────────────────────────────────────────
function AuthModal({ mode, onClose, onSwitch }) {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const isLogin = mode === "login";

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError("");
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin
        ? { email: data.email, password: data.password }
        : { name: data.name, email: data.email, password: data.password };

      const response = await API.post(endpoint, payload);

      if (response.data.success) {
        const userData = {
          name: response.data.user.name,
          email: response.data.user.email,
          token: response.data.token,
          avatar: response.data.user.avatar || null,
        };

        // Remember Me only applies to login (register always persists, since they just signed up)
        if (isLogin && !rememberMe) {
          sessionStorage.setItem("user", JSON.stringify(userData));
          localStorage.removeItem("user");
        } else {
          localStorage.setItem("user", JSON.stringify(userData));
          sessionStorage.removeItem("user");
        }

        navigate("/dashboard");
      }
    } catch (error) {
      setServerError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitch = () => {
    reset();
    setServerError("");
    setShowPassword(false);
    setRememberMe(false);
    onSwitch();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/70"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-all cursor-pointer z-10"
          >
            <FaTimes className="text-sm" />
          </button>

          {/* Scrollable inner wrapper — fixes content getting clipped */}
          <div className="overflow-y-auto max-h-[90vh] rounded-2xl p-8">

            {/* Brand */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-900/50">
                <FaFire className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-extrabold text-zinc-100 tracking-tight">
                {isLogin ? "Welcome back" : "Create account"}
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                {isLogin ? "Login to continue to HabitTracker" : "Start building better habits today"}
              </p>
            </div>

            <div className="border-t border-zinc-800 mb-6" />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                >
                  {serverError}
                </motion.div>
              )}

              {!isLogin && (
                <div>
                  <Input
                    label="Name"
                    placeholder="Enter your name"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
                </div>
              )}

              <div>
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder={isLogin ? "Enter your password" : "Create a password (min 6 chars)"}
                    {...register("password", {
                      required: "Password is required",
                      ...(!isLogin && { minLength: { value: 6, message: "Min 6 characters" } }),
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 bottom-3 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
              </div>

              {/* Remember Me — only show on Login mode */}
              {isLogin && (
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className="flex items-center gap-3 cursor-pointer select-none"
                >
                  <div
                    style={{
                      width: "44px",
                      height: "24px",
                      borderRadius: "12px",
                      background: rememberMe ? "#7c3aed" : "#52525b",
                      padding: "2px",
                      flexShrink: 0,
                      transition: "background 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "white",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                        transform: rememberMe ? "translateX(20px)" : "translateX(0px)",
                        transition: "transform 0.2s ease",
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-300">Remember me</p>
                    <p className="text-xs text-zinc-500">Stay logged in for 30 days</p>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {isLogin ? "Signing In..." : "Creating Account..."}
                  </span>
                ) : isLogin ? "Login" : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-zinc-500 text-sm mt-5">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={handleSwitch}
                className="text-violet-400 hover:text-violet-300 font-medium transition-colors cursor-pointer"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Landing Page ─────────────────────────────────────────────
const features = [
  {
    icon: <FaCheckCircle className="text-violet-400 text-xl" />,
    title: "Daily Check-ins",
    desc: "Mark habits as done every day and build unstoppable momentum.",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: <FaFire className="text-amber-400 text-xl" />,
    title: "Streak Tracking",
    desc: "Watch your streaks grow and stay motivated to never break the chain.",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: <FaChartBar className="text-blue-400 text-xl" />,
    title: "Analytics",
    desc: "Visualize your progress with 7-day trends and category breakdowns.",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: <FaBolt className="text-emerald-400 text-xl" />,
    title: "30-Day Heatmap",
    desc: "See your consistency at a glance with a beautiful activity heatmap.",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
];

function LandingPage() {
  const [authMode, setAuthMode] = useState(null);
  const modalOpen = authMode !== null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-x-hidden">

      <div
        className={`fixed inset-0 z-40 bg-zinc-950/60 backdrop-blur-sm transition-opacity duration-300 ${
          modalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {modalOpen && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSwitch={() => setAuthMode(authMode === "login" ? "register" : "login")}
        />
      )}

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-30 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
              <FaFire className="text-white text-sm" />
            </div>
            <span className="text-base font-bold text-zinc-100">HabitTracker</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setAuthMode("login")}
              className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all duration-200 cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => setAuthMode("register")}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors duration-200 cursor-pointer shadow-lg shadow-violet-900/30"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold">
            <FaBolt className="text-[10px]" />
            Build habits that stick
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Track habits.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              Build consistency.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
            HabitTracker helps you build and maintain daily habits with streaks, heatmaps, and analytics — all in one clean dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setAuthMode("register")}
              className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors duration-200 shadow-lg shadow-violet-900/30 cursor-pointer"
            >
              Start for free →
            </button>
            <button
              onClick={() => setAuthMode("login")}
              className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-medium text-zinc-400 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 cursor-pointer"
            >
              Login
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10 pointer-events-none rounded-2xl" />
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6 text-left shadow-2xl shadow-black/50">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { label: "Total Habits", value: "8", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
                { label: "Done Today", value: "5", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
                { label: "Best Streak", value: "21d", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
                { label: "Success Rate", value: "87%", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${s.bg}`}>
                    <div className={`w-2 h-2 rounded-full ${s.color.replace("text-", "bg-")}`} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">{s.label}</p>
                    <p className="text-base font-extrabold text-zinc-100">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: "Morning Yoga", streak: 12, done: true },
                { name: "Code 1 hour", streak: 21, done: true },
                { name: "Read 20 pages", streak: 5, done: false },
                { name: "Drink 3L Water", streak: 8, done: false },
              ].map((h) => (
                <div
                  key={h.name}
                  className={`p-4 rounded-xl border transition-all ${
                    h.done ? "bg-emerald-500/5 border-emerald-500/20" : "bg-zinc-950 border-zinc-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className={`text-sm font-semibold capitalize ${h.done ? "line-through text-zinc-500" : "text-zinc-100"}`}>
                        {h.name}
                      </p>
                      <p className="text-xs text-amber-400 mt-0.5">🔥 {h.streak} day streak</p>
                    </div>
                    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs ${
                      h.done ? "bg-emerald-500 border-emerald-400 text-white" : "bg-zinc-900 border-zinc-700 text-zinc-600"
                    }`}>✓</div>
                  </div>
                  <div className="flex gap-0.5 flex-wrap mt-2 pt-2 border-t border-zinc-800">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-sm ${
                          Math.random() > (h.done ? 0.25 : 0.55) ? "bg-emerald-500/70" : "bg-zinc-800"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-zinc-900">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
            Everything you need to stay consistent
          </h2>
          <p className="text-sm text-zinc-500 mt-3 max-w-md mx-auto">
            Simple, powerful tools to help you track, analyze, and improve your daily habits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors duration-200"
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${f.bg}`}>
                {f.icon}
              </div>
              <h3 className="text-sm font-bold text-zinc-100 mb-1.5">{f.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-zinc-900">
        <div className="bg-gradient-to-br from-violet-600/20 to-indigo-600/10 border border-violet-500/20 rounded-2xl p-8 sm:p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-violet-900/50">
            <FaFire className="text-white text-xl" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight mb-3">
            Ready to build better habits?
          </h2>
          <p className="text-sm text-zinc-400 mb-7 max-w-sm mx-auto">
            Join HabitTracker today and start your journey towards a more consistent you.
          </p>
          <button
            onClick={() => setAuthMode("register")}
            className="px-8 py-3 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-colors duration-200 shadow-lg shadow-violet-900/30 cursor-pointer"
          >
            Get started for free →
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
              <FaFire className="text-white text-[10px]" />
            </div>
            <span className="text-xs font-semibold text-zinc-500">HabitTracker</span>
          </div>
          <p className="text-xs text-zinc-600">© 2026 HabitTracker. Build better habits.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;