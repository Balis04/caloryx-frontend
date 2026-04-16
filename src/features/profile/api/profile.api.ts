import { apiClient } from "@/lib/api-client";
import type {
  ProfileResponseDto,
  UpdateProfileRequestDto,
} from "../model/profile.types";

const getProfile = () => apiClient<ProfileResponseDto>("/api/user/profile");

const updateProfile = (data: UpdateProfileRequestDto) =>
  apiClient<ProfileResponseDto>("/api/user/profile", {
    method: "PUT",
    body: data,
  });

export const useProfileApi = () => {
  return { getProfile, updateProfile };
};
