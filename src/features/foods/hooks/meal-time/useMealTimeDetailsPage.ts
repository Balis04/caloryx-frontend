import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { getMealTimeSummary } from "../../api/calories-summary.api";
import { deleteFood, updateFoodAmount } from "../../api/food.api";
import {
  formatDateInput,
  getValidDateOrFallback,
  toMealTitle,
  VALID_MEALS,
} from "../../lib/shared/foods.presentation";
import type { FoodLogResponse, MealTime, MealTimeSummaryResponse } from "../../model/food.model";

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
  const [error, setError] = useState<string | null>(null);
  const [activeFoodId, setActiveFoodId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"update" | "delete" | null>(null);
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);
  const [editingAmount, setEditingAmount] = useState<string>("");
  const [actionError, setActionError] = useState<string | null>(null);

  const isValidMeal = Boolean(normalizedMeal && VALID_MEALS.includes(normalizedMeal));

  useEffect(() => {
    const loadMealDetails = async () => {
      if (!normalizedMeal || !VALID_MEALS.includes(normalizedMeal)) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await getMealTimeSummary(date, normalizedMeal);
        setSummary(data);
        setFoods(data.foods ?? []);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to load meal details.";
        setError(message);
        setSummary(null);
        setFoods([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadMealDetails();
  }, [date, normalizedMeal]);

  const consumed = foods.reduce(
    (acc, food) => {
      acc.calories += food.calories;
      acc.protein += food.protein;
      acc.carbohydrates += food.carbohydrates;
      acc.fat += food.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbohydrates: 0, fat: 0 }
  );

  const calorieProgress =
    (summary?.targetCalories ?? 0) > 0
      ? Math.min((consumed.calories / (summary?.targetCalories ?? 1)) * 100, 100)
      : 0;

  const beginEdit = (food: FoodLogResponse) => {
    setEditingFoodId(food.id);
    setEditingAmount(String(food.amount));
    setActionError(null);
  };

  const cancelEdit = () => {
    setEditingFoodId(null);
    setEditingAmount("");
    setActionError(null);
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
      setActionError("Amount must be a positive number.");
      return;
    }

    setActiveFoodId(foodId);
    setActionType("update");
    setActionError(null);

    try {
      await updateFoodAmount(foodId, newAmount);
      await reloadMealDetails();
      cancelEdit();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Update failed.");
    } finally {
      setActiveFoodId(null);
      setActionType(null);
    }
  };

  const handleDelete = async (foodId: string) => {
    setActiveFoodId(foodId);
    setActionType("delete");
    setActionError(null);

    try {
      await deleteFood(foodId);
      await reloadMealDetails();

      if (editingFoodId === foodId) {
        cancelEdit();
      }
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setActiveFoodId(null);
      setActionType(null);
    }
  };

  return {
    actionError,
    actionType,
    activeFoodId,
    beginEdit,
    calorieProgress,
    cancelEdit,
    date,
    editingAmount,
    editingFoodId,
    error,
    foods,
    isLoading,
    isValidMeal,
    mealTitle: normalizedMeal ? toMealTitle(normalizedMeal) : "",
    onBack: () => navigate("/calorie-counter"),
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
