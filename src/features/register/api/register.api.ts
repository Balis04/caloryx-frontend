import { apiClient } from "@/lib/api-client";
import type { RegisterRequestDto, RegisterResponseDto } from "./register.dto";

const register = (data: RegisterRequestDto) =>
  apiClient<RegisterResponseDto>("/api/user/profile", {
    method: "POST",
    body: data,
  });

export const useRegisterApi = () => {
  return { register };
};
