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

export interface CaloriesSummaryResponse {
  date: string;
  targetCalories: number;
  targetProteinGrams: number;
  targetCarbohydratesGrams: number;
  targetFatGrams: number;
  consumedCalories: number;
  consumedProteinGrams: number;
  consumedCarbohydratesGrams: number;
  consumedFatGrams: number;
  targetBreakfastKcal: number;
  consumedBreakfastKcal: number;
  targetLunchKcal: number;
  consumedLunchKcal: number;
  targetDinnerKcal: number;
  consumedDinnerKcal: number;
  targetSnackKcal: number;
  consumedSnackKcal: number;
}

export interface MealTimeSummaryResponse {
  mealTime: MealTime;
  targetCalories: number;
  targetProteinGrams: number;
  targetCarbohydratesGrams: number;
  targetFatGrams: number;
  consumedCalories: number;
  consumedProteinGrams: number;
  consumedCarbohydratesGrams: number;
  consumedFatGrams: number;
  foods: FoodLogResponse[];
}

export interface CustomFoodRequest {
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}

export interface CustomFoodResponse {
  id: string;
  name?: string;
  foodName?: string;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  caloriesPer100g?: number;
  proteinPer100g?: number;
  carbohydratesPer100g?: number;
  fatPer100g?: number;
  brandOwner?: string;
  createdBy?: string;
  createdByName?: string;
}

export interface Food {
  fdcId: number;
  description: string;
  brandOwner?: string;
  servingSizeUnit: string;
  servingSize: number;
  foodNutrients: Nutrient[];
  customFoodId?: string;
}

export interface UsdaFoodSearchItem {
  fdcId: number;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  servingSize: number;
  servingUnit: string;
}

export interface Nutrient {
  nutrientName: string;
  value: number;
  unitName: string;
}
