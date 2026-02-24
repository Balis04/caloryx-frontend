import type {
  ActivityLevel,
  Goal,
  UserRole,
  Gender,
} from "@/shared/types/profile.types";

export type SetFieldFn = <K extends keyof RegisterFormData>(
  key: K,
  value: RegisterFormData[K]
) => void;

export interface RegisterFormData {
  fullName: string;
  birthDate: string; // yyyy-mm-dd
  gender: Gender | null;
  userRole: UserRole | null;

  heightCm: string;
  startWeightKg: string;
  activityLevel: ActivityLevel | null;

  goal: Goal | null;
  targetWeightKg: string;
  weeklyGoalKg: string;
}
