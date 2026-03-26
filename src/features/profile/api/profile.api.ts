import { useApi } from "@/hooks/useApi";
import { useCallback } from "react";
import type {
  ProfileResponseDto,
  UpdateProfileRequestDto,
} from "./profile.dto";

export const useProfileApi = () => {
  const { request } = useApi();

  const getProfile = useCallback(
    () => request<ProfileResponseDto>("/api/user/profile"),
    [request]
  );

  const updateProfile = useCallback(
    (data: UpdateProfileRequestDto) =>
      request<ProfileResponseDto>("/api/user/profile", {
        method: "PUT",
        body: data,
      }),
    [request]
  );

  return { getProfile, updateProfile };
};
