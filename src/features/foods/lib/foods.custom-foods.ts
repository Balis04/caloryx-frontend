import type { CustomFoodResponse, Food, Nutrient } from "../../types";

export const toNumber = (value: string): number => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const toStableNumber = (id: string): number => {
  let hash = 0;

  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }

  return Math.abs(hash) + 1;
};

const pickNumber = (
  food: CustomFoodResponse,
  keys: Array<keyof CustomFoodResponse>
): number => {
  for (const key of keys) {
    const value = food[key];

    if (typeof value === "number") {
      return value;
    }
  }

  return 0;
};

export const mapCustomFoodToFood = (food: CustomFoodResponse): Food => {
  const calories = pickNumber(food, ["calories", "caloriesPer100g"]);
  const protein = pickNumber(food, ["protein", "proteinPer100g"]);
  const carbohydrates = pickNumber(food, ["carbohydrates", "carbohydratesPer100g"]);
  const fat = pickNumber(food, ["fat", "fatPer100g"]);

  const nutrients: Nutrient[] = [
    { nutrientName: "Energy", unitName: "kcal", value: calories },
    { nutrientName: "Protein", unitName: "g", value: protein },
    { nutrientName: "Carbohydrate, by difference", unitName: "g", value: carbohydrates },
    { nutrientName: "Total lipid (fat)", unitName: "g", value: fat },
  ];

  return {
    fdcId: toStableNumber(food.id),
    customFoodId: food.id,
    description: food.name || food.foodName || "Untitled custom food",
    brandOwner: food.brandOwner || food.createdByName || food.createdBy || "User custom food",
    servingSizeUnit: "g",
    servingSize: 100,
    foodNutrients: nutrients,
  };
};

