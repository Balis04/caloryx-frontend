// src/guards/RequireOnboarding.tsx
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import { apiClient } from "../lib/api-client";

export default function RequireOnboarding({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getAccessTokenSilently, logout, isAuthenticated } = useAuth0();
  const [status, setStatus] = useState<
    "loading" | "needsRegister" | "ok" | "error"
  >("loading");

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkStatus = async () => {
      try {
        const token = await getAccessTokenSilently();
        const data = await apiClient<{ hasProfile: boolean }>(
          "/account/has-profile",
          { token }
        );

        setStatus(data.hasProfile ? "ok" : "needsRegister");
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);

        if (message.includes("401") || message.includes("403")) {
          logout({ logoutParams: { returnTo: window.location.origin } });
        } else {
          console.error("Onboarding hiba:", message);
          setStatus("error");
        }
      }
    };

    checkStatus();
  }, [getAccessTokenSilently, logout, isAuthenticated]);

  if (status === "loading")
    return <div className="flex justify-center p-10">Checking profile...</div>;
  if (status === "needsRegister") return <Navigate to="/register" replace />;
  if (status === "error")
    return (
      <div className="p-10 text-red-500">Hiba történt az azonosítás során.</div>
    );

  return <>{children}</>;
}
