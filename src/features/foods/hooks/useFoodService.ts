import { useApi } from "../../../hooks/useApi";
import type { FoodLogRequest, FoodLogResponse } from "../types/food.types";

export const useFoodService = () => {
  const { request } = useApi();

  const saveFood = async (
    payload: FoodLogRequest
  ): Promise<FoodLogResponse> => {
    return request<FoodLogResponse>("/api/food-log/create", {
      body: payload,
      method: "POST",
    });
  };

  const updateFoodAmount = async (
    id: string,
    amount: number
  ): Promise<FoodLogResponse> => {
    return request<FoodLogResponse>(`/api/food-log/${id}/amount`, {
      body: { amount },
      method: "PATCH",
    });
  };

  const deleteFood = async (id: string): Promise<void> => {
    await request<void>(`/api/food-log/${id}`, {
      method: "DELETE",
    });
  };

  return { saveFood, updateFoodAmount, deleteFood };
};
