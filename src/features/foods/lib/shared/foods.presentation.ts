import type { CaloriesSummaryResponse, MealTime } from "../../model/food.model";

export const VALID_MEALS: MealTime[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

export const MEAL_LABELS: Record<MealTime, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACK: "Snacks",
};

export type FoodsMainTab = "usda" | "create" | "saved";
export type SavedFoodsScope = "own" | "other" | "all";

export const FOODS_TAB_META: Record<
  FoodsMainTab,
  { label: string; description: string }
> = {
  usda: {
    label: "USDA search",
    description: "Search public food entries and log them straight into the selected meal.",
  },
  create: {
    label: "Create custom food",
    description: "Save your own reusable food with nutrition values per 100 grams.",
  },
  saved: {
    label: "Saved foods",
    description: "Browse food items already created by you or other users.",
  },
};

export const DIARY_MEALS: Array<{ title: string; type: MealTime; accent: string }> = [
  { title: "Breakfast", type: "BREAKFAST", accent: "from-amber-200/60 to-orange-100/50" },
  { title: "Lunch", type: "LUNCH", accent: "from-emerald-200/60 to-teal-100/50" },
  { title: "Dinner", type: "DINNER", accent: "from-sky-200/60 to-cyan-100/50" },
  { title: "Snacks", type: "SNACK", accent: "from-rose-200/60 to-pink-100/50" },
];

export const formatDateInput = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const shiftDate = (date: string, days: number): string => {
  const base = new Date(`${date}T00:00:00`);
  base.setDate(base.getDate() + days);
  return formatDateInput(base);
};

export const isValidDateInput = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  return formatDateInput(parsed) === value;
};

export const getOptionalValidDate = (value: string | null) => {
  if (!value || !isValidDateInput(value)) {
    return undefined;
  }

  return value;
};

export const getValidDateOrFallback = (value: string | null, fallback: string) => {
  if (!value || !isValidDateInput(value)) {
    return fallback;
  }

  return value;
};

export const formatFoodDateLabel = (date?: string) => {
  if (!date) {
    return "Today";
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsedDate);
};

export const formatDiaryDisplayDate = (date: string): string => {
  const parsed = new Date(`${date}T00:00:00`);
  const safeDate = Number.isNaN(parsed.getTime()) ? new Date() : parsed;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(safeDate);
};

export const mapCaloriesSummaryToFallback = (date: string): CaloriesSummaryResponse => ({
  date,
  targetCalories: 2200,
  targetProteinGrams: 140,
  targetCarbohydratesGrams: 250,
  targetFatGrams: 70,
  consumedCalories: 0,
  consumedProteinGrams: 0,
  consumedCarbohydratesGrams: 0,
  consumedFatGrams: 0,
  targetBreakfastKcal: 550,
  consumedBreakfastKcal: 0,
  targetLunchKcal: 770,
  consumedLunchKcal: 0,
  targetDinnerKcal: 660,
  consumedDinnerKcal: 0,
  targetSnackKcal: 220,
  consumedSnackKcal: 0,
});

export const getMealCalories = (
  summary: CaloriesSummaryResponse,
  mealType: MealTime
): { consumed: number; target: number } => {
  switch (mealType) {
    case "BREAKFAST":
      return { consumed: summary.consumedBreakfastKcal, target: summary.targetBreakfastKcal };
    case "LUNCH":
      return { consumed: summary.consumedLunchKcal, target: summary.targetLunchKcal };
    case "DINNER":
      return { consumed: summary.consumedDinnerKcal, target: summary.targetDinnerKcal };
    case "SNACK":
      return { consumed: summary.consumedSnackKcal, target: summary.targetSnackKcal };
    default:
      return { consumed: 0, target: 0 };
  }
};

export const toMealTitle = (mealTime: MealTime): string => MEAL_LABELS[mealTime] ?? mealTime;
