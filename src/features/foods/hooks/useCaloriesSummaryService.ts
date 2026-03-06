import { useCallback } from "react";
import { useApi } from "../../../hooks/useApi";
import type { CaloriesSummaryResponse } from "../types/food.types";

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

  return { getSummaryByDate };
};
