import { useCallback } from "react";
import { useApi } from "../../../hooks/useApi";
import type {
  CustomFoodRequest,
  CustomFoodResponse,
  FoodLogRequest,
  FoodLogResponse,
} from "../types/food.types";

export const useFoodService = () => {
  const { request } = useApi();

  const saveFood = useCallback(
    async (payload: FoodLogRequest): Promise<FoodLogResponse> => {
      return request<FoodLogResponse>("/api/food-log/create", {
        body: payload,
        method: "POST",
      });
    },
    [request]
  );

  const updateFoodAmount = useCallback(
    async (id: string, amount: number): Promise<FoodLogResponse> => {
      return request<FoodLogResponse>(`/api/food-log/${id}/amount`, {
        body: { amount },
        method: "PATCH",
      });
    },
    [request]
  );

  const deleteFood = useCallback(
    async (id: string): Promise<void> => {
      await request<void>(`/api/food-log/${id}`, {
        method: "DELETE",
      });
    },
    [request]
  );

  const getAllCustomFoods = useCallback(async (): Promise<CustomFoodResponse[]> => {
    return request<CustomFoodResponse[]>("/api/custom-foods", {
      method: "GET",
    });
  }, [request]);

  const getMyCustomFoods = useCallback(async (): Promise<CustomFoodResponse[]> => {
    return request<CustomFoodResponse[]>("/api/custom-foods/mine", {
      method: "GET",
    });
  }, [request]);

  const getOtherCustomFoods = useCallback(async (): Promise<CustomFoodResponse[]> => {
    return request<CustomFoodResponse[]>("/api/custom-foods/not-mine", {
      method: "GET",
    });
  }, [request]);

  const createCustomFood = useCallback(
    async (payload: CustomFoodRequest): Promise<CustomFoodResponse> => {
      return request<CustomFoodResponse>("/api/custom-foods", {
        body: payload,
        method: "POST",
      });
    },
    [request]
  );

  const deleteCustomFood = useCallback(
    async (id: string): Promise<void> => {
      await request<void>(`/api/custom-foods/${id}`, {
        method: "DELETE",
      });
    },
    [request]
  );

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
