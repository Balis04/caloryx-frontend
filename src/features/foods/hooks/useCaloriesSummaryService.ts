import { useCallback } from "react";
import { useApi } from "../../../hooks/useApi";
import type {
  CaloriesSummaryResponse,
  MealTime,
  MealTimeSummaryResponse,
} from "../types/food.types";

export const useCaloriesSummaryService = () => {
  const { request } = useApi();

  const getSummaryByDate = useCallback(
    async (date: string): Promise<CaloriesSummaryResponse> => {
      const query = encodeURIComponent(date);
      return request<CaloriesSummaryResponse>(
        `/api/calories-summary/today?date=${query}`
      );
    },
    [request]
  );

  const getMealTimeSummary = useCallback(
    async (date: string, mealTime: MealTime): Promise<MealTimeSummaryResponse> => {
      const dateQuery = encodeURIComponent(date);
      const mealQuery = encodeURIComponent(mealTime);
      return request<MealTimeSummaryResponse>(
        `/api/calories-summary/meal-times?date=${dateQuery}&mealTime=${mealQuery}`
      );
    },
    [request]
  );

  return { getSummaryByDate, getMealTimeSummary };
};
