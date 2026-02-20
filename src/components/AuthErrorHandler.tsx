import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export function AuthErrorHandler() {
  const { isAuthenticated, isLoading, getAccessTokenSilently, logout } =
    useAuth0();

  useEffect(() => {
    const validate = async () => {
      if (isLoading) return;
      if (!isAuthenticated) return;

      try {
        await getAccessTokenSilently();
      } catch {
        logout({
          logoutParams: { returnTo: window.location.origin },
        });
      }
    };

    validate();
  }, [isAuthenticated, isLoading, getAccessTokenSilently, logout]);

  return null;
}
