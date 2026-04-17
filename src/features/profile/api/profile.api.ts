import { apiClient } from "@/lib/api-client";
import type {
  ProfileResponse,
  UpdateProfileRequest,
} from "../types";

export const getProfile = () => apiClient<ProfileResponse>("/api/user/profile");

export const createProfile = (data: UpdateProfileRequest) =>
  apiClient<ProfileResponse>("/api/user/profile", {
    method: "POST",
    body: data,
  });

export const updateProfile = (data: UpdateProfileRequest) =>
  apiClient<ProfileResponse>("/api/user/profile", {
    method: "PUT",
    body: data,
  });

