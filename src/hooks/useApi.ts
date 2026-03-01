// src/hooks/useApi.ts
import { useAuth0 } from "@auth0/auth0-react";
import { apiClient } from "../lib/api-client";
import type { ApiConfig } from "../lib/api-client";

export const useApi = () => {
  const { getAccessTokenSilently, loginWithRedirect } = useAuth0();

  const request = async <T>(
    endpoint: string,
    config: ApiConfig = {}
  ): Promise<T> => {
    try {
      const token = await getAccessTokenSilently();
      return await apiClient<T>(endpoint, { ...config, token });
    } catch (error: unknown) {
      // Itt ellenőrizzük, hogy a hiba egy objektum-e, aminek van 'error' mezője
      if (
        error &&
        typeof error === "object" &&
        "error" in error &&
        (error as { error: string }).error === "login_required"
      ) {
        console.warn("Session lejárt, újrabejelentkezés szükséges...");
        loginWithRedirect();
      }

      // Ha sima Error objektum, kiírjuk az üzenetét, ha nem, az egészet
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("API hiba:", errorMessage);

      throw error;
    }
  };

  return { request };
};
