import { useViewerProfile } from "@/features/profile/hooks/useViewerProfile";
import { Navigate } from "react-router-dom";

export default function RequireTrainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, loading } = useViewerProfile();

  if (loading) {
    return <div className="flex justify-center p-10">Edzoi jogosultsag ellenorzese...</div>;
  }

  if (profile?.role !== "TRAINER") {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
}
