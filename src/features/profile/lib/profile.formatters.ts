import type { Goal } from "@/shared/types/profile.types";

export const formatBirthDate = (birthDate: string) =>
  new Date(birthDate).toLocaleDateString("hu-HU");

export const formatWeeklyGoal = (goal: Goal | null, value: number) => {
  if (!value || value === 0) {
    return "0 kg";
  }

  const sign = goal === "CUT" ? "-" : "+";
  return `${sign}${value} kg`;
};
