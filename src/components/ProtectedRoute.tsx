import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getValidToken } from "@/lib/auth";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const token = getValidToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
