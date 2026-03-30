import type { RegisterFormData } from "../types/register.types";

export const REGISTER_STEP_COUNT = 3;

export const canAdvanceRegisterStep = (
  step: number,
  values: RegisterFormData
) => {
  if (step === 1) {
    return (
      values.fullName.trim().length > 0 &&
      values.birthDate.length > 0 &&
      values.gender !== null &&
      values.userRole !== null
    );
  }

  if (step === 2) {
    return (
      Number(values.heightCm) > 0 &&
      Number(values.startWeightKg) > 0 &&
      values.activityLevel !== null
    );
  }

  if (step === 3) {
    return (
      values.goal !== null &&
      Number(values.targetWeightKg) > 0 &&
      Number(values.weeklyGoalKg) >= 0
    );
  }

  return false;
};
