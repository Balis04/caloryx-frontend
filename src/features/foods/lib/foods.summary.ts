import type {
  CaloriesSummaryResponse,
  FoodLogResponse,
  MealTime,
} from "../types";
import { MEAL_LABELS } from "./foods.constants";

export const mapCaloriesSummaryToFallback = (
  date: string
): CaloriesSummaryResponse => ({
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
      return {
        consumed: summary.consumedBreakfastKcal,
        target: summary.targetBreakfastKcal,
      };
    case "LUNCH":
      return {
        consumed: summary.consumedLunchKcal,
        target: summary.targetLunchKcal,
      };
    case "DINNER":
      return {
        consumed: summary.consumedDinnerKcal,
        target: summary.targetDinnerKcal,
      };
    case "SNACK":
      return {
        consumed: summary.consumedSnackKcal,
        target: summary.targetSnackKcal,
      };
    default:
      return { consumed: 0, target: 0 };
  }
};

export const toMealTitle = (mealTime: MealTime): string =>
  MEAL_LABELS[mealTime] ?? mealTime;

export const calculateConsumedMealTotals = (foods: FoodLogResponse[]) =>
  foods.reduce(
    (acc, food) => {
      acc.calories += food.calories;
      acc.protein += food.protein;
      acc.carbohydrates += food.carbohydrates;
      acc.fat += food.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbohydrates: 0, fat: 0 }
  );

export const calculateCalorieProgress = (
  consumedCalories: number,
  targetCalories: number
) => {
  if (targetCalories <= 0) {
    return 0;
  }

  return Math.min((consumedCalories / targetCalories) * 100, 100);
};
