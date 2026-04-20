import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { type FoodsMainTab, VALID_MEALS } from "../lib/foods.constants";
import { getOptionalValidDate } from "../lib/foods.date";
import { useCustomFoodForm } from "./useCustomFoodForm";
import { useSavedFoodsList } from "./useSavedFoodsList";
import { useUsdaFoodSearch } from "./useUsdaFoodSearch";
import type { MealTime } from "../types";

export const useFoodSearchPage = () => {
  const { mealTime } = useParams<{ mealTime: string }>();
  const [searchParams] = useSearchParams();
  const consumedDate = getOptionalValidDate(searchParams.get("date") ?? null);

  const normalizedMealParam = mealTime?.toUpperCase();
  const isValidMeal =
    !!normalizedMealParam &&
    VALID_MEALS.includes(normalizedMealParam as MealTime);
  const normalizedMeal = (normalizedMealParam as MealTime) ?? "BREAKFAST";
  const [activeTab, setActiveTab] = useState<FoodsMainTab>("usda");
  const usdaSearch = useUsdaFoodSearch();
  const savedFoodsList = useSavedFoodsList({
    enabled: activeTab === "saved",
  });
  const customFoodForm = useCustomFoodForm({
    onCreated: () => {
      savedFoodsList.resetSavedFoodsFilters();
      setActiveTab("saved");
    },
  });

  return {
    activeTab,
    customFoodForm,
    consumedDate,
    isValidMeal,
    normalizedMeal,
    savedFoodsList,
    setActiveTab,
    usdaSearch,
  };
};
