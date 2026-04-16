import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import {
  createCustomFood,
  deleteCustomFood,
  getAllCustomFoods,
  getMyCustomFoods,
  getOtherCustomFoods,
} from "../../api/food.api";
import { searchFoods } from "../../api/usda.api";
import { mapCustomFoodToFood, toNumber } from "../../lib/food-search/foods.custom-foods";
import { mapUsdaFoodToFood } from "../../lib/usda.mapper";
import {
  getOptionalValidDate,
  type FoodsMainTab,
  type SavedFoodsScope,
  VALID_MEALS,
} from "../../lib/shared/foods.presentation";
import type { CustomFoodResponse, Food, MealTime } from "../../model/food.model";

export interface NewFoodForm {
  name: string;
  calories: string;
  protein: string;
  carbohydrates: string;
  fat: string;
}

const EMPTY_NEW_FOOD: NewFoodForm = {
  name: "",
  calories: "",
  protein: "",
  carbohydrates: "",
  fat: "",
};

export const useFoodSearchPage = () => {
  const { mealTime } = useParams<{ mealTime: string }>();
  const [searchParams] = useSearchParams();
  const consumedDate = getOptionalValidDate(searchParams.get("date") ?? null);

  const normalizedMealParam = mealTime?.toUpperCase();
  const isValidMeal =
    !!normalizedMealParam && VALID_MEALS.includes(normalizedMealParam as MealTime);
  const normalizedMeal = (normalizedMealParam as MealTime) ?? "BREAKFAST";
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [newFood, setNewFood] = useState<NewFoodForm>(EMPTY_NEW_FOOD);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<FoodsMainTab>("usda");
  const [savedScope, setSavedScope] = useState<SavedFoodsScope>("own");
  const [savedFoods, setSavedFoods] = useState<Food[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [savedError, setSavedError] = useState<string | null>(null);
  const [savedSearchTerm, setSavedSearchTerm] = useState("");
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialFoods = async () => {
      setIsLoading(true);

      try {
        const response = await searchFoods("cheddar cheese", "LIDL");
        setFoods((response ?? []).map(mapUsdaFoodToFood));
      } catch (error) {
        console.error(error);
        setFoods([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadInitialFoods();
  }, []);

  useEffect(() => {
    if (activeTab !== "saved") {
      return;
    }

    const loadSavedFoods = async () => {
      setSavedLoading(true);
      setSavedError(null);

      try {
        const response =
          savedScope === "own"
            ? await getMyCustomFoods()
            : savedScope === "other"
              ? await getOtherCustomFoods()
              : await getAllCustomFoods();

        const items = Array.isArray(response)
          ? response
          : ((response as { content?: CustomFoodResponse[] }).content ?? []);

        setSavedFoods(items.map(mapCustomFoodToFood));
      } catch (e) {
        setSavedError(e instanceof Error ? e.message : "Failed to load saved foods.");
        setSavedFoods([]);
      } finally {
        setSavedLoading(false);
      }
    };

    void loadSavedFoods();
  }, [activeTab, savedScope]);

  const query = savedSearchTerm.trim().toLowerCase();
  const filteredSavedFoods = !query
    ? savedFoods
    : savedFoods.filter((food) => food.description.toLowerCase().includes(query));

  const search = async (product: string, brand: string) => {
    if (!product && !brand) {
      setFoods([]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await searchFoods(product, brand);
      setFoods((response ?? []).map(mapUsdaFoodToFood));
    } catch (error) {
      console.error(error);
      setFoods([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFood = async (event: FormEvent) => {
    event.preventDefault();
    setCreateError(null);

    const name = newFood.name.trim();

    if (!name) {
      setCreateError("Name is required.");
      return;
    }

    const calories = toNumber(newFood.calories);
    const protein = toNumber(newFood.protein);
    const carbohydrates = toNumber(newFood.carbohydrates);
    const fat = toNumber(newFood.fat);

    if ([calories, protein, carbohydrates, fat].some((value) => value < 0)) {
      setCreateError("Nutrition values cannot be negative.");
      return;
    }

    setCreateLoading(true);

    try {
      await createCustomFood({ name, calories, protein, carbohydrates, fat });
      setNewFood(EMPTY_NEW_FOOD);
      setSavedScope("own");
      setSavedSearchTerm("");
      setActiveTab("saved");
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : "Creation failed.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteSavedFood = async (foodId?: string) => {
    if (!foodId) {
      return;
    }

    setActiveDeleteId(foodId);
    setSavedError(null);

    try {
      await deleteCustomFood(foodId);
      const response = await getMyCustomFoods();
      const items = Array.isArray(response)
        ? response
        : ((response as { content?: CustomFoodResponse[] }).content ?? []);
      setSavedFoods(items.map(mapCustomFoodToFood));
    } catch (e) {
      setSavedError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setActiveDeleteId(null);
    }
  };

  return {
    activeDeleteId,
    activeTab,
    consumedDate,
    createError,
    createLoading,
    filteredSavedFoods,
    foods,
    isLoading,
    isValidMeal,
    newFood,
    onSearch: search,
    normalizedMeal,
    savedError,
    savedLoading,
    savedScope,
    savedSearchTerm,
    setActiveTab,
    setNewFood,
    setSavedScope,
    setSavedSearchTerm,
    handleCreateFood,
    handleDeleteSavedFood,
  };
};
