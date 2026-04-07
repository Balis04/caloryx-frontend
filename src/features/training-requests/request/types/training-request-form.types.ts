import type { ActivityLevel, Goal } from "@/shared/types/profile.types";

export interface TrainingRequestFormData {
  weeklyWorkouts: string;
  preferredSessionLength: string;
  trainingLocation: string;
  currentWeightKg: string;
  targetWeightKg: string;
  goal: Goal | "";
  activityLevel: ActivityLevel | "";
  customerDescription: string;
}
