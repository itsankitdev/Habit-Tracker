import { FaFire } from "react-icons/fa";

function AuthCard({ subtitle, children }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-900/40">
            <FaFire className="text-white text-xl" />
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-100 tracking-tight">HabitTracker</h1>
          {subtitle && (
            <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="border-t border-zinc-800" />
        {children}
      </div>
    </div>
  );
}

export default AuthCard;