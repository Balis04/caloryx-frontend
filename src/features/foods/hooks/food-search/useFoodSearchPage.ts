import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import {
  getOptionalValidDate,
  type FoodsMainTab,
  VALID_MEALS,
} from "../../lib/shared/foods.presentation";
import type { MealTime } from "../../model/food.model";

export const useFoodSearchPage = () => {
  const { mealTime } = useParams<{ mealTime: string }>();
  const [searchParams] = useSearchParams();
  const consumedDate = getOptionalValidDate(searchParams.get("date") ?? null);

  const normalizedMealParam = mealTime?.toUpperCase();
  const isValidMeal =
    !!normalizedMealParam && VALID_MEALS.includes(normalizedMealParam as MealTime);
  const normalizedMeal = (normalizedMealParam as MealTime) ?? "BREAKFAST";
  const [activeTab, setActiveTab] = useState<FoodsMainTab>("usda");

  return {
    activeTab,
    consumedDate,
    isValidMeal,
    normalizedMeal,
    setActiveTab,
  };
};
