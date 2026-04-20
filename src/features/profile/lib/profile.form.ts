import type { ProfileResponse } from "../types";

export type ProfileFormValues = Omit<
  ProfileResponse,
  | "heightCm"
  | "startWeightKg"
  | "actualWeightKg"
  | "targetWeightKg"
  | "weeklyGoalKg"
  | "role"
> & {
  heightCm: string;
  startWeightKg: string;
  actualWeightKg: string;
  targetWeightKg: string;
  weeklyGoalKg: string;
  userRole: ProfileResponse["role"];
};

export const initialProfileFormValues: ProfileFormValues = {
  fullName: "",
  birthDate: "",
  gender: null,
  userRole: null,
  heightCm: "",
  startWeightKg: "",
  actualWeightKg: "",
  activityLevel: null,
  goal: null,
  targetWeightKg: "",
  weeklyGoalKg: "",
};

