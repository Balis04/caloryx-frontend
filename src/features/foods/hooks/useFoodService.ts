// src/features/foods/hooks/useFoodService.ts
import { useApi } from "../../../hooks/useApi";
import type { FoodLogRequest, FoodLogResponse } from "../types/food.types";

export const useFoodService = () => {
  const { request } = useApi(); // Ez a hook már tudja a tokent!

  const saveFood = async (
    payload: FoodLogRequest
  ): Promise<FoodLogResponse> => {
    // A 'request' automatikusan lekéri a tokent és beleírja a headerbe
    return request<FoodLogResponse>("/food-log/create", {
      body: payload,
      method: "POST",
    });
  };

  return { saveFood };
};
