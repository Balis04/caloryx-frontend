import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/use-auth";

export default function RedirectIfOnboarded({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authState, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center p-10">Checking profile...</div>;
  }

  if (authState?.hasProfile) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
}
