import { useApi } from "@/hooks/useApi";
import { useCallback } from "react";
import type { ProfileResponse } from "../types/profile.types";

export const useProfileService = () => {
  const { request } = useApi();

  const getProfile = useCallback(
    () => request<ProfileResponse>("/user/profile"),
    [request]
  );

  const updateProfile = useCallback(
    (data: Partial<ProfileResponse>) =>
      request<ProfileResponse>("/user/profile", {
        method: "PUT",
        body: data,
      }),
    [request]
  );

  return { getProfile, updateProfile };
};
