import { apiClient } from "@/lib/api-client";
import type {
  CaloriesSummaryResponse,
  MealTime,
  MealTimeSummaryResponse,
} from "../types";

export const getSummaryByDate = async (
  date: string
): Promise<CaloriesSummaryResponse> => {
  const query = encodeURIComponent(date);
  return apiClient<CaloriesSummaryResponse>(`/api/calories-summary?date=${query}`);
};

export const getMealTimeSummary = async (
  date: string,
  mealTime: MealTime
): Promise<MealTimeSummaryResponse> => {
  const dateQuery = encodeURIComponent(date);
  const mealQuery = encodeURIComponent(mealTime);
  return apiClient<MealTimeSummaryResponse>(
    `/api/calories-summary/meal-times?date=${dateQuery}&mealTime=${mealQuery}`
  );
};

