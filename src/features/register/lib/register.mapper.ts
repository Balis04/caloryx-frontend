import type { RegisterRequestDto } from "../api/register.dto";
import type { RegisterFormData } from "../types/register.types";

export const mapRegisterFormToRequestDto = (
  formData: RegisterFormData
): RegisterRequestDto => ({
  fullName: formData.fullName.trim(),
  birthDate: formData.birthDate,
  gender: formData.gender,
  role: formData.userRole,
  heightCm: Number(formData.heightCm),
  startWeightKg: Number(formData.startWeightKg),
  actualWeightKg: Number(formData.startWeightKg),
  activityLevel: formData.activityLevel,
  goal: formData.goal,
  targetWeightKg: Number(formData.targetWeightKg),
  weeklyGoalKg: Number(formData.weeklyGoalKg),
});
