import { apiClient } from "../../../lib/api-client";
import type { Food } from "../types/food.types";

export interface FoodSearchResponse {
  foods: Food[];
  totalHits: number;
}

export const fetchFoodsFromProxy = async (product: string, brand: string) => {
  const params = new URLSearchParams();
  if (product) params.append("query", product);
  if (brand) params.append("brand", brand);

  return apiClient<FoodSearchResponse>(
    `/api/foods/search?${params.toString()}`
  );
};
