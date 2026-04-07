import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/use-auth";

export default function AuthRedirectPage() {
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
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-medium">Authenticating...</p>
        <div className="mx-auto mt-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    </div>
  );
}
