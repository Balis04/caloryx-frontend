import type { Nutrient } from "../model/food.model";

export const getNutrientValue = (
  nutrients: Nutrient[],
  name: string
): number => {
  return (
    nutrients.find((n) => n.nutrientName.toLowerCase() === name.toLowerCase())
      ?.value || 0
  );
};
