import type { Food, FoodLogRequest, MealTime } from "../types/food.types";
import { getNutrientValue } from "./nutrientUtils";

const toConsumedAtIso = (consumedDate?: string): string => {
  if (!consumedDate) {
    return new Date().toISOString();
  }

  return new Date(`${consumedDate}T12:00:00Z`).toISOString();
};

export const createFoodLogPayload = (
  food: Food,
  mealTime: string,
  totalGrams: number,
  calc: (val: number) => number,
  consumedDate?: string
): FoodLogRequest => ({
  foodName: food.description,
  mealTime: mealTime.toUpperCase() as MealTime,
  amount: totalGrams,
  unit: "g",
  calories: calc(getNutrientValue(food.foodNutrients, "Energy")),
  protein: calc(getNutrientValue(food.foodNutrients, "Protein")),
  carbohydrates: calc(
    getNutrientValue(food.foodNutrients, "Carbohydrate, by difference")
  ),
  fat: calc(getNutrientValue(food.foodNutrients, "Total lipid (fat)")),
  consumedAt: toConsumedAtIso(consumedDate),
});
