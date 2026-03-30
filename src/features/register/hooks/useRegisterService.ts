// src/features/auth/hooks/useRegisterService.ts
import { useApi } from "../../../hooks/useApi";
import { useAuth } from "@/features/auth/use-auth";
import type { RegisterFormData } from "../types/register.types";

export const useRegisterService = () => {
  const { request } = useApi();
  const { refreshAuth } = useAuth();

  const registerUser = async (data: RegisterFormData) => {
    const response = await request("/api/user/profile", {
      method: "POST",
      body: {
        fullName: data.fullName,
        birthDate: data.birthDate,
        gender: data.gender,
        role: data.userRole,
        heightCm: Number(data.heightCm),
        startWeightKg: Number(data.startWeightKg),
        actualWeightKg: Number(data.startWeightKg),
        activityLevel: data.activityLevel,
        goal: data.goal,
        targetWeightKg: Number(data.targetWeightKg),
        weeklyGoalKg: Number(data.weeklyGoalKg),
      },
    });

    await refreshAuth();
    return response;
  };

  return { registerUser };
};
