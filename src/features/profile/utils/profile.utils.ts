import type { Goal } from "@/shared/types/profile.types";
import type { ProfileResponse } from "../types/profile.types";

export const getProgressMessage = (profile: ProfileResponse) => {
  const diff = profile.actualWeightKg - profile.startWeightKg;
  const absDiff = Math.abs(diff).toFixed(1);
  const isSteady = Math.abs(diff) < 0.5;

  switch (profile.goal) {
    case "CUT":
      return diff < 0
        ? `Gratulálunk, már ${absDiff} kg-ot fogytál az indulás óta!`
        : "Induljon a fogyás, az első lépés a legnehezebb!";

    case "BULK":
      return diff > 0
        ? `Szuper munka, már ${absDiff} kg-ot szedtél fel!`
        : "Kezdődjön az építkezés, minden gramm számít!";

    case "MAINTAIN":
      return isSteady
        ? "Remekül tartod a formád, csak így tovább!"
        : `Kicsit elmozdultál az induló súlytól (${absDiff} kg), de a fókusz megvan!`;

    default:
      return "Minden nagy utazás az első lépéssel kezdődik!";
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
