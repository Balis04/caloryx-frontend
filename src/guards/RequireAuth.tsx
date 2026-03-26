import { useEffect } from "react";
import { useAuth } from "@/features/auth/use-auth";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, login } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      login();
    }
  }, [isAuthenticated, isLoading, login]);

  if (isLoading || !isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  return <>{children}</>;
}
