import { apiClient } from "@/lib/api-client";
import type {
  ProfileResponse,
  UpdateProfileRequest,
} from "../model/profile.types";

const getProfile = () => apiClient<ProfileResponse>("/api/user/profile");

const createProfile = (data: UpdateProfileRequest) =>
  apiClient<ProfileResponse>("/api/user/profile", {
    method: "POST",
    body: data,
  });

const updateProfile = (data: UpdateProfileRequest) =>
  apiClient<ProfileResponse>("/api/user/profile", {
    method: "PUT",
    body: data,
  });

export const useProfileApi = () => {
  return { getProfile, createProfile, updateProfile };
};
