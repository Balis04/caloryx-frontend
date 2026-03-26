import { apiClient } from "../lib/api-client";
import type { ApiConfig } from "../lib/api-client";
import { useCallback } from "react";

export const useApi = () => {
  const request = useCallback(
    async <T>(endpoint: string, config: ApiConfig = {}): Promise<T> => {
      return apiClient<T>(endpoint, config);
    },
    []
  );

  return { request };
};
