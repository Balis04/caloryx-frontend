import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

type AccountResponse = {
  hasProfile: boolean;
};

export default function RequireOnboarding({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getAccessTokenSilently, logout } = useAuth0();
  const [status, setStatus] = useState<
    "loading" | "needsRegister" | "ok" | "error"
  >("loading");

  useEffect(() => {
    const check = async () => {
      try {
        const token = await getAccessTokenSilently();

        const res = await fetch("/account/needs-register", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401 || res.status === 403) {
          logout({
            logoutParams: { returnTo: window.location.origin },
          });
          return;
        }

        if (!res.ok) {
          console.error("Onboarding check failed:", res.status, res.statusText);
          setStatus("error");
          return;
        }

        const data: AccountResponse = await res.json();

        setStatus(data.hasProfile ? "ok" : "needsRegister");
      } catch (error) {
        console.error("Failed to check onboarding status", error);
        setStatus("error");
      }
    };

    check();
  }, [getAccessTokenSilently, logout]);

  if (status === "loading") return <div>Loading...</div>;

  if (status === "error")
    return <div>Something went wrong. Please refresh.</div>;

  if (status === "needsRegister") return <Navigate to="/register" replace />;

  return <>{children}</>;
}
