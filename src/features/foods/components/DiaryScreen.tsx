import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCaloriesSummaryService } from "../hooks/useCaloriesSummaryService";
import type { CaloriesSummaryResponse } from "../types/food.types";

type MealTime = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";

const MEALS: { title: string; type: MealTime }[] = [
  { title: "Breakfast", type: "BREAKFAST" },
  { title: "Lunch", type: "LUNCH" },
  { title: "Dinner", type: "DINNER" },
  { title: "Snacks", type: "SNACK" },
];

const formatDateInput = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const shiftDate = (date: string, days: number): string => {
  const base = new Date(`${date}T00:00:00`);
  base.setDate(base.getDate() + days);
  return formatDateInput(base);
};

const formatHuDate = (date: string): string => {
  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(`${date}T00:00:00`));
};

const mapApiToFallback = (date: string): CaloriesSummaryResponse => ({
  date,
  targetCalories: 2200,
  targetProteinGrams: 140,
  targetCarbohydratesGrams: 250,
  targetFatGrams: 70,
  consumedCalories: 0,
  consumedProteinGrams: 0,
  consumedCarbohydratesGrams: 0,
  consumedFatGrams: 0,
  targetbreakfastkcal: 550,
  consumedbreakfastkcal: 0,
  targetlunchkcal: 770,
  consumedlunchkcal: 0,
  targetdinnerkcal: 660,
  consumeddinnerkcal: 0,
  targetsnackkcal: 220,
  consumedsnackkcal: 0,
});

const getMealCalories = (summary: CaloriesSummaryResponse, mealType: MealTime) => {
  switch (mealType) {
    case "BREAKFAST":
      return {
        consumed: summary.consumedbreakfastkcal,
        target: summary.targetbreakfastkcal,
      };
    case "LUNCH":
      return {
        consumed: summary.consumedlunchkcal,
        target: summary.targetlunchkcal,
      };
    case "DINNER":
      return {
        consumed: summary.consumeddinnerkcal,
        target: summary.targetdinnerkcal,
      };
    case "SNACK":
      return {
        consumed: summary.consumedsnackkcal,
        target: summary.targetsnackkcal,
      };
    default:
      return { consumed: 0, target: 0 };
  }
};

export default function DiaryScreen() {
  const navigate = useNavigate();
  const { getSummaryByDate } = useCaloriesSummaryService();

  const [selectedDate, setSelectedDate] = useState<string>(
    formatDateInput(new Date())
  );
  const [summary, setSummary] = useState<CaloriesSummaryResponse>(
    mapApiToFallback(formatDateInput(new Date()))
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
        if (!isMounted) return;
        setSummary(data);
      } catch (error) {
        if (!isMounted) return;
        const message =
          error instanceof Error ? error.message : "Nem sikerult lekerdezni.";
        setSummaryError(message);
        setSummary(mapApiToFallback(selectedDate));
      } finally {
        if (isMounted) {
          setIsLoadingSummary(false);
        }
      }
    };

    loadSummary();

    return () => {
      isMounted = false;
    };
  }, [getSummaryByDate, selectedDate]);

  const caloriesRemaining = Math.max(
    summary.targetCalories - summary.consumedCalories,
    0
  );

  const progress = useMemo(() => {
    if (summary.targetCalories <= 0) return 0;
    return Math.min(
      (summary.consumedCalories / summary.targetCalories) * 100,
      100
    );
  }, [summary.consumedCalories, summary.targetCalories]);

  const openMeal = (mealType: MealTime) => {
    navigate(`/foods/${mealType.toLowerCase()}?date=${selectedDate}`);
  };

  return (
    <div className="flex flex-col h-full bg-background p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h1 className="text-3xl font-bold">Naplo</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedDate(formatDateInput(new Date()))}
        >
          Ma
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2 space-y-3">
          <CardTitle className="text-xl">Napi osszegzes</CardTitle>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedDate((prev) => shiftDate(prev, -1))}
              aria-label="Elozo nap"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) setSelectedDate(e.target.value);
              }}
              className="max-w-[190px]"
            />

            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedDate((prev) => shiftDate(prev, 1))}
              aria-label="Kovetkezo nap"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Kivalasztott nap: {formatHuDate(selectedDate)}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {summaryError && (
            <p className="text-sm text-destructive">{summaryError}</p>
          )}

          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-bold">
                {Math.round(summary.consumedCalories)} kcal
              </p>
              <p className="text-sm text-muted-foreground">
                {isLoadingSummary ? "Betoltes..." : "Napi elfogyasztas"}
              </p>
            </div>
            <Badge variant="secondary" className="text-sm py-1 px-3">
              {Math.round(caloriesRemaining)} kcal hatra
            </Badge>
          </div>

          <Progress value={progress} />

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-muted p-3 text-center">
              <p className="text-xs text-muted-foreground">Zsir</p>
              <p className="font-semibold">
                {Math.round(summary.consumedFatGrams)} g
              </p>
            </div>
            <div className="rounded-lg bg-muted p-3 text-center">
              <p className="text-xs text-muted-foreground">Feherje</p>
              <p className="font-semibold">
                {Math.round(summary.consumedProteinGrams)} g
              </p>
            </div>
            <div className="rounded-lg bg-muted p-3 text-center">
              <p className="text-xs text-muted-foreground">Szenhidrat</p>
              <p className="font-semibold">
                {Math.round(summary.consumedCarbohydratesGrams)} g
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {Math.round(summary.consumedCalories)} kcal elfogyasztva
            </span>
            <span>{Math.round(summary.targetCalories)} kcal cel</span>
          </div>
        </CardContent>
      </Card>

      {MEALS.map((meal) => {
        const mealCalories = getMealCalories(summary, meal.type);

        return (
          <div
            key={meal.type}
            className="flex justify-between items-center p-4 mb-3 bg-white rounded-2xl shadow-sm border border-border"
          >
            <div>
              <p className="text-lg font-semibold">{meal.title}</p>
              <p className="text-muted-foreground text-sm">
                {Math.round(mealCalories.consumed)} / {Math.round(mealCalories.target)} kcal
              </p>
            </div>

            <Button
              size="icon"
              className="rounded-full bg-blue-500 hover:bg-blue-600"
              onClick={() => openMeal(meal.type)}
            >
              <Plus className="w-5 h-5 text-white" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
