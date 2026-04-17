import type { Food, FoodLogRequest, MealTime } from "../types";

const getNutrientValue = (name: string, food: Food) => {
  return (
    food.foodNutrients.find(
      (nutrient) => nutrient.nutrientName.toLowerCase() === name.toLowerCase()
    )?.value ?? 0
  );
};

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
  calories: calc(getNutrientValue("Energy", food)),
  protein: calc(getNutrientValue("Protein", food)),
  carbohydrates: calc(getNutrientValue("Carbohydrate, by difference", food)),
  fat: calc(getNutrientValue("Total lipid (fat)", food)),
  consumedAt: toConsumedAtIso(consumedDate),
});

