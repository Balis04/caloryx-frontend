import type { Goal } from "@/shared/types/profile.types";
import type { ProfileResponse } from "../types/profile.types";

export const getProgressMessage = (profile: ProfileResponse) => {
  const diff = profile.actualWeightKg - profile.startWeightKg;
  const absDiff = Math.abs(diff).toFixed(1);
  const isSteady = Math.abs(diff) < 0.5;

  switch (profile.goal) {
    case "CUT":
      return diff < 0
        ? `Great work, you have already lost ${absDiff} kg since you started!`
        : "Your weight-loss journey starts now. The first step is the hardest.";

    case "BULK":
      return diff > 0
        ? `Nice job, you have already gained ${absDiff} kg!`
        : "Time to start building. Every gram counts.";

    case "MAINTAIN":
      return isSteady
        ? "You are maintaining your form well. Keep it up."
        : `You have moved ${absDiff} kg from your starting weight, but your focus is still there.`;

    default:
      return "Every great journey starts with a single step.";
  }
};

export const calculateProgress = (profile: ProfileResponse): number => {
  const { startWeightKg, actualWeightKg, targetWeightKg, goal } = profile;

  if (goal === "MAINTAIN") return 100;

  const totalDistance = targetWeightKg - startWeightKg;
  const distanceCovered = actualWeightKg - startWeightKg;

  if (totalDistance === 0) return 100;

  const progress = (distanceCovered / totalDistance) * 100;
  return Math.max(0, Math.min(100, progress));
};

export const formatWeeklyGoal = (goal: Goal | null, value: number) => {
  if (!value || value === 0) return "0 kg";

  const sign = goal === "CUT" ? "-" : "+";
  return `${sign}${value} kg`;
};
