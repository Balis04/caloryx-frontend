import { useApi } from "@/hooks/useApi";
import { useCallback } from "react";
import type { RegisterRequestDto, RegisterResponseDto } from "./register.dto";

export const useRegisterApi = () => {
  const { request } = useApi();

  const register = useCallback(
    (data: RegisterRequestDto) =>
      request<RegisterResponseDto>("/api/user/profile", {
        method: "POST",
        body: data,
      }),
    [request]
  );

  return { register };
};
