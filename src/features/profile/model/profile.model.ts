import type {
  ActivityLevel,
  Gender,
  Goal,
  UserRole,
} from "@/shared/types/profile.types";

export interface Profile {
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
