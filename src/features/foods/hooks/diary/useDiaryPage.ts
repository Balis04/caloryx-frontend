import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCaloriesSummaryApi } from "../../api/calories-summary.api";
import {
  DIARY_MEALS,
  formatDateInput,
  formatDiaryDisplayDate,
  getMealCalories,
  mapCaloriesSummaryToFallback,
  shiftDate,
} from "../../lib/shared/foods.presentation";
import type { CaloriesSummaryResponse, MealTime } from "../../model/food.model";

export const useDiaryPage = () => {
  const navigate = useNavigate();
  const { getSummaryByDate } = useCaloriesSummaryApi();

  const today = formatDateInput(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [summary, setSummary] = useState<CaloriesSummaryResponse>(
    mapCaloriesSummaryToFallback(today)
  );
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSummary = async () => {
      setIsLoadingSummary(true);
      setSummaryError(null);

      try {
        const data = await getSummaryByDate(selectedDate);

        if (!isMounted) {
          return;
        }

        setSummary(data);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message = error instanceof Error ? error.message : "Failed to fetch summary.";
        setSummaryError(message);
        setSummary(mapCaloriesSummaryToFallback(selectedDate));
      } finally {
        if (isMounted) {
          setIsLoadingSummary(false);
        }
      }
    };

    void loadSummary();

    return () => {
      isMounted = false;
    };
  }, [getSummaryByDate, selectedDate]);

  const caloriesRemaining = Math.max(summary.targetCalories - summary.consumedCalories, 0);

  const progress = useMemo(() => {
    if (summary.targetCalories <= 0) {
      return 0;
    }

    return Math.min((summary.consumedCalories / summary.targetCalories) * 100, 100);
  }, [summary.consumedCalories, summary.targetCalories]);

  const meals = useMemo(
    () =>
      DIARY_MEALS.map((meal) => {
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
      }),
    [summary]
  );

  const openMealForAdd = (mealType: MealTime) => {
    navigate(`/foods/${mealType.toLowerCase()}?date=${selectedDate}`);
  };

  const openMealDetails = (mealType: MealTime) => {
    navigate(`/calorie-counter/meal/${mealType.toLowerCase()}?date=${selectedDate}`);
  };

  return {
    caloriesRemaining,
    formattedSelectedDate: formatDiaryDisplayDate(selectedDate),
    isLoadingSummary,
    meals,
    openMealDetails,
    openMealForAdd,
    progress,
    selectedDate,
    setSelectedDate,
    shiftSelectedDate: (days: number) => setSelectedDate((prev) => shiftDate(prev, days)),
    summary,
    summaryError,
    today,
  };
};

export type UseDiaryPageResult = ReturnType<typeof useDiaryPage>;
