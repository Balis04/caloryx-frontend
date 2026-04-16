import { apiClient } from "@/lib/api-client";
import type { UsdaFoodSearchItem } from "../model/food.model";

const fetchFoodsFromProxy = async (product: string, brand: string) => {
  const params = new URLSearchParams();
  if (product) params.append("query", product);
  if (brand) params.append("brand", brand);

  return apiClient<UsdaFoodSearchItem[]>(`/api/foods/search?${params.toString()}`);
};

export const useUsdaApi = () => {
  return { fetchFoodsFromProxy };
};
