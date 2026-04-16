import { apiClient } from "@/lib/api-client";
import type {
  CustomFoodRequest,
  CustomFoodResponse,
  FoodLogRequest,
  FoodLogResponse,
} from "../model/food.model";

export const saveFood = (payload: FoodLogRequest): Promise<FoodLogResponse> =>
  apiClient<FoodLogResponse>("/api/food-log", {
    body: payload,
    method: "POST",
  });

export const updateFoodAmount = (
  id: string,
  amount: number
): Promise<FoodLogResponse> =>
  apiClient<FoodLogResponse>(`/api/food-log/${id}/amount`, {
    body: { amount },
    method: "PATCH",
  });

export const deleteFood = async (id: string): Promise<void> => {
  await apiClient<void>(`/api/food-log/${id}`, {
    method: "DELETE",
  });
};

export const getAllCustomFoods = (): Promise<CustomFoodResponse[]> =>
  apiClient<CustomFoodResponse[]>("/api/custom-foods", {
    method: "GET",
  });

export const getMyCustomFoods = (): Promise<CustomFoodResponse[]> =>
  apiClient<CustomFoodResponse[]>("/api/custom-foods/mine", {
    method: "GET",
  });

export const getOtherCustomFoods = (): Promise<CustomFoodResponse[]> =>
  apiClient<CustomFoodResponse[]>("/api/custom-foods/not-mine", {
    method: "GET",
  });

export const createCustomFood = (
  payload: CustomFoodRequest
): Promise<CustomFoodResponse> =>
  apiClient<CustomFoodResponse>("/api/custom-foods", {
    body: payload,
    method: "POST",
  });

export const deleteCustomFood = async (id: string): Promise<void> => {
  await apiClient<void>(`/api/custom-foods/${id}`, {
    method: "DELETE",
  });
};
