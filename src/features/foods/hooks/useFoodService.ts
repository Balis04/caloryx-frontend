import { useApi } from "../../../hooks/useApi";
import type { FoodLogRequest, FoodLogResponse } from "../types/food.types";

export const useFoodService = () => {
  const { request } = useApi();

  const saveFood = async (
    payload: FoodLogRequest
  ): Promise<FoodLogResponse> => {
    return request<FoodLogResponse>("/food-log/create", {
      body: payload,
      method: "POST",
    });
  };

  return { saveFood };
};
