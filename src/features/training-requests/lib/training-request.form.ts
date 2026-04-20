import type { ProfileResponse } from "@/features/profile/types";

import type { TrainingRequestFormData } from "../types";

export const createInitialTrainingRequestFormData = (
  profile?: ProfileResponse | null
): TrainingRequestFormData => ({
  weeklyWorkouts: "",
  preferredSessionLength: "",
  trainingLocation: "",
  currentWeightKg: profile?.actualWeightKg ? String(profile.actualWeightKg) : "",
  targetWeightKg: profile?.targetWeightKg ? String(profile.targetWeightKg) : "",
  goal: profile?.goal ?? "",
  activityLevel: profile?.activityLevel ?? "",
  customerDescription: "",
});
