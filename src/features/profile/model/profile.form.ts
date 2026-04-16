import type { ProfileResponseDto } from "./profile.types";

export type ProfileFormValues = Omit<
  ProfileResponseDto,
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
  userRole: ProfileResponseDto["role"];
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
