import { useApi } from "@/hooks/useApi";
import { useCallback } from "react";
import type { UsdaFoodSearchItem } from "../model/food.model";

export const useUsdaApi = () => {
  const { request } = useApi();

  const fetchFoodsFromProxy = useCallback(
    async (product: string, brand: string) => {
      const params = new URLSearchParams();
      if (product) params.append("query", product);
      if (brand) params.append("brand", brand);

      return request<UsdaFoodSearchItem[]>(`/api/foods/search?${params.toString()}`);
    },
    [request]
  );

  return { fetchFoodsFromProxy };
};
