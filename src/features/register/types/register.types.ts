export type Gender = "MALE" | "FEMALE";
export type ActivityLevel = "SEDENTARY" | "LIGHT" | "MODERATE" | "ACTIVE";
export type Goal = "CUT" | "MAINTAIN" | "BULK";
export type UserRole = "USER" | "TRAINER";

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
