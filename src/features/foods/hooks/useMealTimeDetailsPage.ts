import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { getMealTimeSummary } from "../api/calories-summary.api";
import { deleteFood, updateFoodAmount } from "../api/food.api";
import { VALID_MEALS } from "../lib/foods.constants";
import { formatDateInput, getValidDateOrFallback } from "../lib/foods.date";
import {
  calculateCalorieProgress,
  calculateConsumedMealTotals,
  toMealTitle,
} from "../lib/foods.summary";
import type {
  FoodLogResponse,
  MealTime,
  MealTimeSummaryResponse,
} from "../types";

export const useMealTimeDetailsPage = () => {
  const { mealTime } = useParams<{ mealTime: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const normalizedMeal = mealTime?.toUpperCase() as MealTime;
  const fallbackDate = formatDateInput(new Date());
  const date = getValidDateOrFallback(searchParams.get("date"), fallbackDate);

  const [summary, setSummary] = useState<MealTimeSummaryResponse | null>(null);
  const [foods, setFoods] = useState<FoodLogResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFoodId, setActiveFoodId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"update" | "delete" | null>(
    null
  );
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);
  const [editingAmount, setEditingAmount] = useState<string>("");

  const isValidMeal = Boolean(
    normalizedMeal && VALID_MEALS.includes(normalizedMeal)
  );

  useEffect(() => {
    const loadMealDetails = async () => {
      if (!normalizedMeal || !VALID_MEALS.includes(normalizedMeal)) {
        return;
      }

      setIsLoading(true);

      try {
        const data = await getMealTimeSummary(date, normalizedMeal);
        setSummary(data);
        setFoods(data.foods ?? []);
      } catch {
        setSummary(null);
        setFoods([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadMealDetails();
  }, [date, normalizedMeal]);
  const consumed = calculateConsumedMealTotals(foods);
  const calorieProgress = calculateCalorieProgress(
    consumed.calories,
    summary?.targetCalories ?? 0
  );

  const beginEdit = (food: FoodLogResponse) => {
    setEditingFoodId(food.id);
    setEditingAmount(String(food.amount));
  };

  const cancelEdit = () => {
    setEditingFoodId(null);
    setEditingAmount("");
  };

  const reloadMealDetails = async () => {
    if (!normalizedMeal || !VALID_MEALS.includes(normalizedMeal)) {
      return;
    }

    const data = await getMealTimeSummary(date, normalizedMeal);
    setSummary(data);
    setFoods(data.foods ?? []);
  };

  const saveEdit = async (foodId: string) => {
    const newAmount = Number(editingAmount);

    if (Number.isNaN(newAmount) || newAmount <= 0) {
      return;
    }

    setActiveFoodId(foodId);
    setActionType("update");

    try {
      await updateFoodAmount(foodId, newAmount);
      await reloadMealDetails();
      cancelEdit();
    } finally {
      setActiveFoodId(null);
      setActionType(null);
    }
  };

  const handleDelete = async (foodId: string) => {
    setActiveFoodId(foodId);
    setActionType("delete");

    try {
      await deleteFood(foodId);
      await reloadMealDetails();

      if (editingFoodId === foodId) {
        cancelEdit();
      }
    } finally {
      setActiveFoodId(null);
      setActionType(null);
    }
  };

  return {
    actionType,
    activeFoodId,
    beginEdit,
    calorieProgress,
    cancelEdit,
    date,
    editingAmount,
    editingFoodId,
    foods,
    isLoading,
    isValidMeal,
    mealTitle: normalizedMeal ? toMealTitle(normalizedMeal) : "",
    openAddFood: () => {
      if (!normalizedMeal) {
        return;
      }

      navigate(`/foods/${normalizedMeal.toLowerCase()}?date=${date}`);
    },
    saveEdit,
    setEditingAmount,
    summary,
    consumed,
    handleDelete,
  };
};
