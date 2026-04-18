import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import {
  createCustomFood,
  deleteCustomFood,
  getAllCustomFoods,
  getMyCustomFoods,
  getOtherCustomFoods,
} from "../api/food.api";
import { mapCustomFoodToFood, toNumber } from "../lib/foods.custom-foods";
import type { CustomFoodForm, CustomFoodResponse, Food } from "../types";
import type { SavedFoodsScope } from "../lib/foods.formatters";

const EMPTY_CUSTOM_FOOD_FORM: CustomFoodForm = {
  name: "",
  calories: "",
  protein: "",
  carbohydrates: "",
  fat: "",
};

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

interface UseCustomFoodsOptions {
  isSavedTabActive: boolean;
  onCreated?: () => void;
}

export const useCustomFoods = ({
  isSavedTabActive,
  onCreated,
}: UseCustomFoodsOptions) => {
  const [form, setForm] = useState<CustomFoodForm>(EMPTY_CUSTOM_FOOD_FORM);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [savedFoods, setSavedFoods] = useState<Food[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [savedError, setSavedError] = useState<string | null>(null);
  const [savedScope, setSavedScope] = useState<SavedFoodsScope>("own");
  const [savedSearchTerm, setSavedSearchTerm] = useState("");
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!isSavedTabActive) {
      return;
    }

    const loadSavedFoods = async () => {
      setSavedLoading(true);
      setSavedError(null);

      try {
        setSavedFoods(await getSavedFoodsByScope(savedScope));
      } catch (error) {
        setSavedError(
          error instanceof Error ? error.message : "Failed to load saved foods."
        );
        setSavedFoods([]);
      } finally {
        setSavedLoading(false);
      }
    };

    void loadSavedFoods();
  }, [isSavedTabActive, savedScope]);

  const filteredSavedFoods = !savedSearchTerm.trim()
    ? savedFoods
    : savedFoods.filter((food) =>
        food.description
          .toLowerCase()
          .includes(savedSearchTerm.trim().toLowerCase())
      );

  const createFood = async (event: FormEvent) => {
    event.preventDefault();
    setCreateError(null);

    const name = form.name.trim();
    if (!name) {
      setCreateError("Name is required.");
      return;
    }

    const calories = toNumber(form.calories);
    const protein = toNumber(form.protein);
    const carbohydrates = toNumber(form.carbohydrates);
    const fat = toNumber(form.fat);

    if ([calories, protein, carbohydrates, fat].some((value) => value < 0)) {
      setCreateError("Nutrition values cannot be negative.");
      return;
    }

    setCreateLoading(true);

    try {
      await createCustomFood({ name, calories, protein, carbohydrates, fat });
      setForm(EMPTY_CUSTOM_FOOD_FORM);
      setSavedScope("own");
      setSavedSearchTerm("");
      onCreated?.();
    } catch (error) {
      setCreateError(
        error instanceof Error ? error.message : "Creation failed."
      );
    } finally {
      setCreateLoading(false);
    }
  };

  const deleteSavedFood = async (foodId?: string) => {
    if (!foodId) {
      return;
    }

    setActiveDeleteId(foodId);
    setSavedError(null);

    try {
      await deleteCustomFood(foodId);
      setSavedFoods(await getSavedFoodsByScope("own"));
      setSavedScope("own");
    } catch (error) {
      setSavedError(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setActiveDeleteId(null);
    }
  };

  return {
    activeDeleteId,
    createError,
    createFood,
    createLoading,
    deleteSavedFood,
    filteredSavedFoods,
    form,
    savedError,
    savedLoading,
    savedScope,
    savedSearchTerm,
    setForm,
    setSavedScope,
    setSavedSearchTerm,
  };
};
