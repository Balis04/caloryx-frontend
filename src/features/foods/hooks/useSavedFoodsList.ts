import { useEffect, useState } from "react";

import {
  deleteCustomFood,
  getAllCustomFoods,
  getMyCustomFoods,
  getOtherCustomFoods,
} from "../api/food.api";
import type { SavedFoodsScope } from "../lib/foods.constants";
import { mapCustomFoodToFood } from "../lib/foods.custom-foods";
import type { CustomFoodResponse, Food } from "../types";

const getSavedFoodsByScope = async (savedScope: SavedFoodsScope) => {
  const response =
    savedScope === "own"
      ? await getMyCustomFoods()
      : savedScope === "other"
      ? await getOtherCustomFoods()
      : await getAllCustomFoods();

  const items = Array.isArray(response)
    ? response
    : (response as { content?: CustomFoodResponse[] }).content ?? [];

  return items.map(mapCustomFoodToFood);
};

interface UseSavedFoodsListOptions {
  enabled: boolean;
}

export const useSavedFoodsList = ({
  enabled,
}: UseSavedFoodsListOptions) => {
  const [savedFoods, setSavedFoods] = useState<Food[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [savedScope, setSavedScope] = useState<SavedFoodsScope>("own");
  const [savedSearchTerm, setSavedSearchTerm] = useState("");
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const loadSavedFoods = async () => {
      setSavedLoading(true);

      try {
        setSavedFoods(await getSavedFoodsByScope(savedScope));
      } catch {
        setSavedFoods([]);
      } finally {
        setSavedLoading(false);
      }
    };

    void loadSavedFoods();
  }, [enabled, savedScope]);

  const filteredSavedFoods = !savedSearchTerm.trim()
    ? savedFoods
    : savedFoods.filter((food) =>
        food.description
          .toLowerCase()
          .includes(savedSearchTerm.trim().toLowerCase())
      );

  const deleteSavedFood = async (foodId?: string) => {
    if (!foodId) {
      return;
    }

    setActiveDeleteId(foodId);

    try {
      await deleteCustomFood(foodId);
      setSavedFoods(await getSavedFoodsByScope("own"));
      setSavedScope("own");
    } catch {
    } finally {
      setActiveDeleteId(null);
    }
  };

  const resetSavedFoodsFilters = () => {
    setSavedScope("own");
    setSavedSearchTerm("");
  };

  return {
    activeDeleteId,
    deleteSavedFood,
    filteredSavedFoods,
    resetSavedFoodsFilters,
    savedLoading,
    savedScope,
    savedSearchTerm,
    setSavedScope,
    setSavedSearchTerm,
  };
};
