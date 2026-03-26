import { useState, useEffect } from "react";
import { fetchFoodsFromProxy } from "../api/usda.api";
import { mapUsdaFoodToFood } from "../lib/usda.mapper";
import type { Food } from "../model/food.model";

export function useFoodSearch(initialProduct: string, initialBrand: string) {
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSearch, setActiveSearch] = useState({
    product: initialProduct,
    brand: initialBrand,
  });

  useEffect(() => {
    const search = async () => {
      if (!activeSearch.product && !activeSearch.brand) return;
      setIsLoading(true);
      try {
        const data = await fetchFoodsFromProxy(
          activeSearch.product,
          activeSearch.brand
        );
        setFoods((data ?? []).map(mapUsdaFoodToFood));
      } catch (err) {
        console.error(err);
        setFoods([]);
      } finally {
        setIsLoading(false);
      }
    };
    search();
  }, [activeSearch]);

  return { foods, isLoading, performSearch: setActiveSearch };
}
