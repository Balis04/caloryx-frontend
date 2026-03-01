// src/features/foods/services/usdaApi.ts
import { apiClient } from "../../../lib/api-client";
import type { Food } from "../types/food.types";

export interface FoodSearchResponse {
  foods: Food[];
  totalHits: number;
}

// src/features/foods/services/usdaApi.ts
export const fetchFoodsFromProxy = async (product: string, brand: string) => {
  const params = new URLSearchParams();
  if (product) params.append("query", product);
  if (brand) params.append("brand", brand);

  // Ha az apiClient BASE_URL-je "http://localhost:5173",
  // akkor itt a kezdő "/" karakter fontos.
  return apiClient<FoodSearchResponse>(
    `/api/foods/search?${params.toString()}`
  );
};
