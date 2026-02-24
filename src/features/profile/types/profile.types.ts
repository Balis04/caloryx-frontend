import type {
  ActivityLevel,
  Goal,
  UserRole,
  Gender,
} from "@/shared/types/profile.types";

export interface ProfileResponse {
  fullName: string;
  birthDate: string;
  gender: Gender | null;
  role: UserRole | null;
  heightCm: number;
  startWeightKg: number;
  actualWeightKg: number;
  targetWeightKg: number;
  weeklyGoalKg: number;
  activityLevel: ActivityLevel | null;
  goal: Goal | null;
}

export type ProfileEditData = Omit<
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
