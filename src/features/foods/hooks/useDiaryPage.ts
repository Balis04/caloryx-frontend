import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getSummaryByDate } from "../api/calories-summary.api";
import { DIARY_MEALS } from "../lib/foods.constants";
import { formatDateInput, shiftDate } from "../lib/foods.date";
import {
  getMealCalories,
  mapCaloriesSummaryToFallback,
} from "../lib/foods.summary";
import type { CaloriesSummaryResponse, MealTime } from "../types";

export const useDiaryPage = () => {
  const navigate = useNavigate();

  const today = formatDateInput(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [summary, setSummary] = useState<CaloriesSummaryResponse>(
    mapCaloriesSummaryToFallback(today)
  );
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    const loadSummary = async () => {
      setSummaryError(null);

      try {
        const data = await getSummaryByDate(selectedDate);
        setSummary(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to fetch summary.";
        setSummaryError(message);
        setSummary(mapCaloriesSummaryToFallback(selectedDate));
      }
    };

    void loadSummary();
  }, [selectedDate]);

  const caloriesRemaining = Math.max(
    summary.targetCalories - summary.consumedCalories,
    0
  );
  const progress =
    summary.targetCalories <= 0
      ? 0
      : Math.min(
          (summary.consumedCalories / summary.targetCalories) * 100,
          100
        );

  const meals = DIARY_MEALS.map((meal) => {
    const mealCalories = getMealCalories(summary, meal.type);
    const mealProgress =
      mealCalories.target > 0
        ? Math.min((mealCalories.consumed / mealCalories.target) * 100, 100)
        : 0;

    return {
      ...meal,
      mealCalories,
      mealProgress,
    };
  });

  const openMealForAdd = (mealType: MealTime) => {
    navigate(`/foods/${mealType.toLowerCase()}?date=${selectedDate}`);
  };

  const openMealDetails = (mealType: MealTime) => {
    navigate(
      `/calorie-counter/meal/${mealType.toLowerCase()}?date=${selectedDate}`
    );
  };

  return {
    caloriesRemaining,
    meals,
    openMealDetails,
    openMealForAdd,
    progress,
    selectedDate,
    setSelectedDate,
    shiftSelectedDate: (days: number) =>
      setSelectedDate((prev) => shiftDate(prev, days)),
    summary,
    summaryError,
    today,
  };
};
