import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";

import AuthLayout from "../components/layout/AuthLayout";
import AuthCard from "../components/auth/AuthCard";
import Button from "../components/ui/Button";
import FadeIn from "../components/ui/FadeIn";

function NotFound() {
  const navigate = useNavigate();

  return (
    // We use AuthLayout here because it perfectly centers content on the screen 
    // and naturally hides the sidebar layout grid for public/error views!
    <AuthLayout>
      <FadeIn>
        <AuthCard subtitle="Error Code: 404">
          <div className="flex flex-col items-center text-center space-y-6 py-4">
            
            {/* Glowing Caution Micro-interaction Icon */}
            <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-bounce duration-1000">
              <FaExclamationTriangle className="text-4xl" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
                Page Not Found
              </h1>
              <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                The terminal destination you are looking for does not exist or has been permanently archived.
              </p>
            </div>

            {/* Navigation Return Action Trigger */}
            <Button 
              onClick={() => navigate("/")} 
              className="flex items-center justify-center gap-2 px-6 h-12 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800 hover:border-zinc-700 w-full transition-all"
            >
              <FaArrowLeft className="text-xs" />
              <span>Return to Dashboard</span>
            </Button>
            
          </div>
        </AuthCard>
      </FadeIn>
    </AuthLayout>
  );
}

export default NotFound;