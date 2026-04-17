import { useEffect, useState } from "react";

import { searchFoods } from "../../api/usda.api";
import { mapUsdaFoodToFood } from "../../lib/usda.mapper";
import type { Food } from "../../model/food.model";

export const useUsdaFoodSearch = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadInitialFoods = async () => {
      setLoading(true);

      try {
        const response = await searchFoods("cheddar cheese", "LIDL");
        setFoods((response ?? []).map(mapUsdaFoodToFood));
      } catch (error) {
        console.error(error);
        setFoods([]);
      } finally {
        setLoading(false);
      }
    };

    void loadInitialFoods();
  }, []);

  const search = async (product: string, brand: string) => {
    if (!product && !brand) {
      setFoods([]);
      return;
    }

    setLoading(true);

    try {
      const response = await searchFoods(product, brand);
      setFoods((response ?? []).map(mapUsdaFoodToFood));
    } catch (error) {
      console.error(error);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    foods,
    loading,
    search,
  };
};
