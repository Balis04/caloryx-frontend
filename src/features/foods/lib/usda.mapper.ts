import type { Food, Nutrient, UsdaFoodSearchItem } from "../types";

const buildNutrients = (item: UsdaFoodSearchItem): Nutrient[] => [
  { nutrientName: "Energy", unitName: "kcal", value: item.calories },
  { nutrientName: "Protein", unitName: "g", value: item.protein },
  {
    nutrientName: "Carbohydrate, by difference",
    unitName: "g",
    value: item.carbohydrates,
  },
  { nutrientName: "Total lipid (fat)", unitName: "g", value: item.fat },
];

export const mapUsdaFoodToFood = (item: UsdaFoodSearchItem): Food => ({
  fdcId: item.fdcId,
  description: item.name,
  brandOwner: item.brand,
  servingSizeUnit: item.servingUnit,
  servingSize: item.servingSize,
  foodNutrients: buildNutrients(item),
});

