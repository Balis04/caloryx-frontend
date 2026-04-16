import { apiClient } from "@/lib/api-client";
import type {
  CustomFoodRequest,
  CustomFoodResponse,
  FoodLogRequest,
  FoodLogResponse,
} from "../model/food.model";

const saveFood = (payload: FoodLogRequest): Promise<FoodLogResponse> =>
  apiClient<FoodLogResponse>("/api/food-log", {
    body: payload,
    method: "POST",
  });

const updateFoodAmount = (id: string, amount: number): Promise<FoodLogResponse> =>
  apiClient<FoodLogResponse>(`/api/food-log/${id}/amount`, {
    body: { amount },
    method: "PATCH",
  });

const deleteFood = async (id: string): Promise<void> => {
  await apiClient<void>(`/api/food-log/${id}`, {
    method: "DELETE",
  });
};

const getAllCustomFoods = (): Promise<CustomFoodResponse[]> =>
  apiClient<CustomFoodResponse[]>("/api/custom-foods", {
    method: "GET",
  });

const getMyCustomFoods = (): Promise<CustomFoodResponse[]> =>
  apiClient<CustomFoodResponse[]>("/api/custom-foods/mine", {
    method: "GET",
  });

const getOtherCustomFoods = (): Promise<CustomFoodResponse[]> =>
  apiClient<CustomFoodResponse[]>("/api/custom-foods/not-mine", {
    method: "GET",
  });

const createCustomFood = (payload: CustomFoodRequest): Promise<CustomFoodResponse> =>
  apiClient<CustomFoodResponse>("/api/custom-foods", {
    body: payload,
    method: "POST",
  });

const deleteCustomFood = async (id: string): Promise<void> => {
  await apiClient<void>(`/api/custom-foods/${id}`, {
    method: "DELETE",
  });
};

export const useFoodApi = () => {
  return {
    saveFood,
    updateFoodAmount,
    deleteFood,
    getAllCustomFoods,
    getMyCustomFoods,
    getOtherCustomFoods,
    createCustomFood,
    deleteCustomFood,
  };
};
