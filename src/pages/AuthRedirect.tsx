import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export default function AuthRedirect() {
  const { isAuthenticated, isLoading, getAccessTokenSilently, logout } =
    useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      if (isLoading) return;
      if (!isAuthenticated) return;

      try {
        const token = await getAccessTokenSilently();

        const res = await fetch("/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 404) {
          navigate("/onboarding", { replace: true });
          return;
        }

        if (res.ok) {
          navigate("/profile", { replace: true });
          return;
        }
      } catch {
        logout({
          logoutParams: { returnTo: window.location.origin },
        });
      }
    };

    run();
  }, [isAuthenticated, getAccessTokenSilently, navigate, isLoading, logout]);

  return <div>Loading...</div>;
}
