import { useAuth0 } from "@auth0/auth0-react";
import { apiClient } from "../lib/api-client";
import type { ApiConfig } from "../lib/api-client";
import { useCallback } from "react";

export const useApi = () => {
  const { getAccessTokenSilently, loginWithRedirect } = useAuth0();

  const request = useCallback(
    async <T>(endpoint: string, config: ApiConfig = {}): Promise<T> => {
      try {
        const token = await getAccessTokenSilently();
        return await apiClient<T>(endpoint, { ...config, token });
      } catch (error: unknown) {
        if (
          error &&
          typeof error === "object" &&
          "error" in error &&
          (error as { error: string }).error === "login_required"
        ) {
          console.warn("Session expired, sign-in required again...");
          loginWithRedirect();
        }

        if (!config.suppressErrorLog) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          console.error("API error:", errorMessage);
        }

        throw error;
      }
    },
    [getAccessTokenSilently, loginWithRedirect]
  );

  return { request };
};
