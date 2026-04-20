import type { CustomFoodForm } from "../types";
import { toNumber } from "./foods.custom-foods";

export const validateCustomFoodForm = (
  values: CustomFoodForm
): string | null => {
  const name = values.name.trim();

  if (!name) {
    return "Name is required.";
  }

  const calories = toNumber(values.calories);
  const protein = toNumber(values.protein);
  const carbohydrates = toNumber(values.carbohydrates);
  const fat = toNumber(values.fat);

  if ([calories, protein, carbohydrates, fat].some((value) => value < 0)) {
    return "Nutrition values cannot be negative.";
  }

  return null;
};
