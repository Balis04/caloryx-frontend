import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

type AuthBootstrapResponse = {
  hasProfile: boolean;
};

export default function AuthRedirect() {
  const { isAuthenticated, isLoading, getAccessTokenSilently, logout } =
    useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      if (isLoading) return;

      if (!isAuthenticated) {
        return;
      }

      try {
        const token = await getAccessTokenSilently();

        const res = await fetch("/account/has-profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          console.error("401 from backend - token likely invalid/missing");
          return;
        }

        if (!res.ok) {
          logout({ logoutParams: { returnTo: window.location.origin } });
          return;
        }

        const data: AuthBootstrapResponse = await res.json();

        if (data.hasProfile) {
          navigate("/profile", { replace: true });
        } else {
          navigate("/register", { replace: true });
        }
      } catch {
        logout({ logoutParams: { returnTo: window.location.origin } });
      }
    };

    run();
  }, [isAuthenticated, isLoading, getAccessTokenSilently, navigate, logout]);

  return <div>Loading...</div>;
}
