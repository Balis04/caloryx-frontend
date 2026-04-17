import type {
  ProfileResponse,
  UpdateProfileRequest,
} from "../types";
import {
  initialProfileFormValues,
  type ProfileFormValues,
} from "../lib/profile.form";

export const mapProfileResponseToFormValues = (
  profile: ProfileResponse | null | undefined
): ProfileFormValues => {
  if (!profile) {
    return initialProfileFormValues;
  }

  const safeActualWeight =
    profile.actualWeightKg > 0 ? profile.actualWeightKg : profile.startWeightKg;

  return {
    ...profile,
    birthDate: profile.birthDate ? profile.birthDate.split("T")[0] : "",
    heightCm: String(profile.heightCm ?? ""),
    startWeightKg: String(profile.startWeightKg ?? ""),
    actualWeightKg: String(safeActualWeight ?? ""),
    targetWeightKg: String(profile.targetWeightKg ?? ""),
    weeklyGoalKg: String(profile.weeklyGoalKg ?? ""),
    userRole: profile.role,
  };
};

export const mapProfileFormValuesToRequest = (
  values: ProfileFormValues
): UpdateProfileRequest => {
  const { userRole, ...restValues } = values;
  return {
    ...restValues,
    role: userRole,
    heightCm: Number(values.heightCm),
    startWeightKg: Number(values.startWeightKg),
    actualWeightKg: Number(values.actualWeightKg),
    targetWeightKg: Number(values.targetWeightKg),
    weeklyGoalKg: Number(values.weeklyGoalKg),
  };
};

