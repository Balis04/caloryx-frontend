import { useAuth } from "@/features/auth/use-auth";
import { Navigate } from "react-router-dom";

export default function RequireCoach({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, hasAnyRole } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center p-10">Checking coach access...</div>;
  }

  if (!hasAnyRole("COACH")) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
}
