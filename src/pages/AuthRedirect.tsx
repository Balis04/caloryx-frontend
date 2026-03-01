import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../lib/api-client";

export default function AuthRedirect() {
  const { isAuthenticated, isLoading, getAccessTokenSilently, logout } =
    useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfileAndRedirect = async () => {
      if (isLoading || !isAuthenticated) return;

      try {
        const token = await getAccessTokenSilently();

        const data = await apiClient<{ hasProfile: boolean }>(
          "/account/has-profile",
          {
            token,
          }
        );

        if (data.hasProfile) {
          navigate("/profile", { replace: true });
        } else {
          navigate("/register", { replace: true });
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Auth redirect hiba:", message);

        logout({ logoutParams: { returnTo: window.location.origin } });
      }
    };

    checkProfileAndRedirect();
  }, [isAuthenticated, isLoading, getAccessTokenSilently, navigate, logout]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <p className="text-lg font-medium">Azonosítás folyamatban...</p>
        <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}
