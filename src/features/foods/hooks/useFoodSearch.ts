import { useState, useEffect } from "react";
import { fetchUsdaFoods } from "../services/usdaApi";
import type { Food } from "../types/food.types";

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
        const data = await fetchUsdaFoods(
          activeSearch.product,
          activeSearch.brand
        );
        setFoods(data.foods || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    search();
  }, [activeSearch]);

  return { foods, isLoading, performSearch: setActiveSearch };
}
