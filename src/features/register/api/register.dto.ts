import type {
  ActivityLevel,
  Gender,
  Goal,
  UserRole,
} from "@/shared/types/profile.types";

export interface RegisterRequestDto {
  fullName: string;
  birthDate: string;
  gender: Gender | null;
  role: UserRole | null;
  heightCm: number;
  startWeightKg: number;
  actualWeightKg: number;
  activityLevel: ActivityLevel | null;
  goal: Goal | null;
  targetWeightKg: number;
  weeklyGoalKg: number;
}

export interface RegisterResponseDto {
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
