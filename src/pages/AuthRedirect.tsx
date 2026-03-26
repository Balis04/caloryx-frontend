import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/use-auth";

export default function AuthRedirect() {
  const { isLoading, refreshAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfileAndRedirect = async () => {
      if (isLoading) return;

      try {
        const data = await refreshAuth();

        if (data?.hasProfile) {
          navigate("/profile", { replace: true });
        } else {
          navigate(data?.authenticated ? "/register" : "/", { replace: true });
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Auth redirect error:", message);
        navigate("/", { replace: true });
      }
    };

    checkProfileAndRedirect();
  }, [isLoading, navigate, refreshAuth]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <p className="text-lg font-medium">Authenticating...</p>
        <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}
