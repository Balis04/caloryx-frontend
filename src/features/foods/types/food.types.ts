export type MealTime = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";

export interface FoodLogRequest {
  foodName: string;
  mealTime: MealTime;
  amount: number;
  unit: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  consumedAt: string;
}

export interface FoodLogResponse extends FoodLogRequest {
  id: string;
  auth0Id: string;
  createdAt: string;
}

export interface Food {
  fdcId: number;
  description: string;
  brandOwner?: string;

  servingSizeUnit: string;
  servingSize: number;
  foodNutrients: Nutrient[];
}

export interface Nutrient {
  nutrientName: string;
  value: number;
  unitName: string;
}
