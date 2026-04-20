import type { MealTime } from "../types";

export const VALID_MEALS: MealTime[] = [
  "BREAKFAST",
  "LUNCH",
  "DINNER",
  "SNACK",
];

export const MEAL_LABELS: Record<MealTime, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACK: "Snacks",
};

export type FoodsMainTab = "usda" | "create" | "saved";
export type SavedFoodsScope = "own" | "other" | "all";

export const DIARY_MEALS: Array<{
  title: string;
  type: MealTime;
  accent: string;
}> = [
  {
    title: "Breakfast",
    type: "BREAKFAST",
    accent: "from-amber-200/60 to-orange-100/50",
  },
  {
    title: "Lunch",
    type: "LUNCH",
    accent: "from-emerald-200/60 to-teal-100/50",
  },
  {
    title: "Dinner",
    type: "DINNER",
    accent: "from-sky-200/60 to-cyan-100/50",
  },
  {
    title: "Snacks",
    type: "SNACK",
    accent: "from-rose-200/60 to-pink-100/50",
  },
];
