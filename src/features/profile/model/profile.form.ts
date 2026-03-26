import type { Profile } from "./profile.model";

export type ProfileFormValues = Omit<
  Profile,
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
  userRole: Profile["role"];
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
