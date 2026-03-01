// src/features/auth/hooks/useRegisterService.ts
import { useApi } from "../../../hooks/useApi";
import type { RegisterFormData } from "../types/register.types";

export const useRegisterService = () => {
  const { request } = useApi();

  const registerUser = async (data: RegisterFormData) => {
    return request("/user/register", {
      method: "POST",
      body: {
        fullName: data.fullName,
        birthDate: data.birthDate,
        gender: data.gender,
        heightCm: Number(data.heightCm),
        startWeightKg: Number(data.startWeightKg),
        activityLevel: data.activityLevel,
        goal: data.goal,
        targetWeightKg: Number(data.targetWeightKg),
        weeklyGoalKg: Number(data.weeklyGoalKg),
      },
    });
  };

  return { registerUser };
};
