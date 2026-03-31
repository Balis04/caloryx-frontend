import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  CaloriexPage,
  GlassCard,
  GlassMetric,
  HeroBadge,
  PageHero,
  SummaryPanel,
} from "@/components/caloriex";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

import { useCaloriesSummaryService } from "../hooks/useCaloriesSummaryService";
import type { CaloriesSummaryResponse, MealTime } from "../model/food.model";

const MEALS: { title: string; type: MealTime; accent: string }[] = [
  { title: "Breakfast", type: "BREAKFAST", accent: "from-amber-200/60 to-orange-100/50" },
  { title: "Lunch", type: "LUNCH", accent: "from-emerald-200/60 to-teal-100/50" },
  { title: "Dinner", type: "DINNER", accent: "from-sky-200/60 to-cyan-100/50" },
  { title: "Snacks", type: "SNACK", accent: "from-rose-200/60 to-pink-100/50" },
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

const formatDisplayDate = (date: string): string =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));

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
  targetBreakfastKcal: 550,
  consumedBreakfastKcal: 0,
  targetLunchKcal: 770,
  consumedLunchKcal: 0,
  targetDinnerKcal: 660,
  consumedDinnerKcal: 0,
  targetSnackKcal: 220,
  consumedSnackKcal: 0,
});

const getMealCalories = (
  summary: CaloriesSummaryResponse,
  mealType: MealTime
): { consumed: number; target: number } => {
  switch (mealType) {
    case "BREAKFAST":
      return { consumed: summary.consumedBreakfastKcal, target: summary.targetBreakfastKcal };
    case "LUNCH":
      return { consumed: summary.consumedLunchKcal, target: summary.targetLunchKcal };
    case "DINNER":
      return { consumed: summary.consumedDinnerKcal, target: summary.targetDinnerKcal };
    case "SNACK":
      return { consumed: summary.consumedSnackKcal, target: summary.targetSnackKcal };
    default:
      return { consumed: 0, target: 0 };
  }
};

export default function DiaryPage() {
  const navigate = useNavigate();
  const { getSummaryByDate } = useCaloriesSummaryService();

  const today = formatDateInput(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [summary, setSummary] = useState<CaloriesSummaryResponse>(mapApiToFallback(today));
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
        const message = error instanceof Error ? error.message : "Failed to fetch summary.";
        setSummaryError(message);
        setSummary(mapApiToFallback(selectedDate));
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
    if (summary.targetCalories <= 0) return 0;
    return Math.min((summary.consumedCalories / summary.targetCalories) * 100, 100);
  }, [summary.consumedCalories, summary.targetCalories]);

  const openMealForAdd = (mealType: MealTime) => {
    navigate(`/foods/${mealType.toLowerCase()}?date=${selectedDate}`);
  };

  const openMealDetails = (mealType: MealTime) => {
    navigate(`/calorie-counter/meal/${mealType.toLowerCase()}?date=${selectedDate}`);
  };

  return (
    <CaloriexPage>
      <PageHero
        badge={<HeroBadge>Diary overview</HeroBadge>}
        title="Track the whole day in one place, then jump into any meal to log details."
        description="The foods package now uses the same refreshed CalorieX page system, so summary panels, meal cards, and action areas stay visually consistent."
        chips={[
          formatDisplayDate(selectedDate),
          isLoadingSummary ? "Refreshing summary" : "Daily snapshot",
          "Meal-first logging",
        ]}
        aside={
          <GlassCard className="hidden overflow-hidden xl:block">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Selected date</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                    {formatDisplayDate(selectedDate)}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Review totals, then open a meal to add or edit foods for this day.
                  </p>
                </div>
                <Badge className="rounded-full bg-slate-950 px-3 py-1 text-white hover:bg-slate-950">
                  {Math.round(caloriesRemaining)} kcal left
                </Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <GlassMetric
                  label="Consumed"
                  value={`${Math.round(summary.consumedCalories)} kcal`}
                  description={
                    isLoadingSummary ? "Loading current daily intake." : "Current total for the selected day."
                  }
                />
                <GlassMetric
                  label="Target"
                  value={`${Math.round(summary.targetCalories)} kcal`}
                  description="Daily calorie goal used for progress tracking."
                />
              </div>
            </CardContent>
          </GlassCard>
        }
      />

      <section className="relative container mx-auto px-6 py-12 md:py-16">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_340px]">
          <SummaryPanel eyebrow="Daily summary" title="Macros and progress" icon={Target}>
            <div className="space-y-6 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSelectedDate((prev) => shiftDate(prev, -1))}
                  aria-label="Previous day"
                  className="rounded-full border-white/70 bg-white/70"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    if (e.target.value) setSelectedDate(e.target.value);
                  }}
                  className="max-w-[210px] border-white/70 bg-white/75"
                />

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSelectedDate((prev) => shiftDate(prev, 1))}
                  aria-label="Next day"
                  className="rounded-full border-white/70 bg-white/70"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDate(today)}
                  className="rounded-full border border-white/60 bg-white/55 px-4 text-slate-700 hover:bg-white/75"
                >
                  Today
                </Button>
              </div>

              {summaryError ? <p className="text-sm text-red-700">{summaryError}</p> : null}

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <GlassMetric
                  label="Calories"
                  value={`${Math.round(summary.consumedCalories)} kcal`}
                  description={`Goal ${Math.round(summary.targetCalories)} kcal`}
                />
                <GlassMetric
                  label="Protein"
                  value={`${Math.round(summary.consumedProteinGrams)} g`}
                  description={`Goal ${Math.round(summary.targetProteinGrams)} g`}
                />
                <GlassMetric
                  label="Carbs"
                  value={`${Math.round(summary.consumedCarbohydratesGrams)} g`}
                  description={`Goal ${Math.round(summary.targetCarbohydratesGrams)} g`}
                />
                <GlassMetric
                  label="Fat"
                  value={`${Math.round(summary.consumedFatGrams)} g`}
                  description={`Goal ${Math.round(summary.targetFatGrams)} g`}
                />
              </div>

              <div className="space-y-3 rounded-[28px] border border-white/60 bg-white/65 p-5 backdrop-blur">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-950">Calorie progress</p>
                    <p className="text-sm text-slate-600">
                      {Math.round(summary.consumedCalories)} consumed of {Math.round(summary.targetCalories)} kcal
                    </p>
                  </div>
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
                    {Math.round(progress)}%
                  </Badge>
                </div>
                <Progress value={progress} className="h-3 bg-slate-200/80" />
              </div>
            </div>
          </SummaryPanel>

          <SummaryPanel
            eyebrow="Controls"
            title="Diary focus"
            icon={CalendarDays}
            className="hidden xl:block"
          >
            <div className="space-y-4 p-6 text-sm text-slate-600">
              <p>Pick a date, review the totals, then open a meal card to inspect foods or add new ones.</p>
              <div className="grid gap-3">
                <GlassMetric
                  label="Meals"
                  value="4"
                  description="Breakfast, lunch, dinner, and snacks all open from this screen."
                />
                <GlassMetric
                  label="Status"
                  value={isLoadingSummary ? "Syncing" : "Ready"}
                  description="The summary refreshes each time the selected date changes."
                />
              </div>
            </div>
          </SummaryPanel>
        </div>

        <div className="mt-6 grid gap-4">
          {MEALS.map((meal) => {
            const mealCalories = getMealCalories(summary, meal.type);
            const mealProgress =
              mealCalories.target > 0
                ? Math.min((mealCalories.consumed / mealCalories.target) * 100, 100)
                : 0;

            return (
              <GlassCard
                key={meal.type}
                role="button"
                tabIndex={0}
                onClick={() => openMealDetails(meal.type)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openMealDetails(meal.type);
                  }
                }}
                className="cursor-pointer overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
              >
                <CardContent className="grid gap-5 p-6 md:grid-cols-[minmax(0,1fr)_220px_auto] md:items-center">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-2xl border border-white/70 bg-gradient-to-br ${meal.accent}`} />
                      <div>
                        <p className="text-xl font-semibold tracking-tight text-slate-950">{meal.title}</p>
                        <p className="text-sm text-slate-600">Open meal details or add a new food item.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>{Math.round(mealCalories.consumed)} kcal</span>
                      <span>{Math.round(mealCalories.target)} kcal target</span>
                    </div>
                    <Progress value={mealProgress} className="h-2.5 bg-slate-200/80" />
                  </div>

                  <div className="flex items-center justify-end">
                    <Button
                      size="icon"
                      className="h-11 w-11 rounded-full bg-slate-950 text-white hover:bg-slate-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        openMealForAdd(meal.type);
                      }}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </GlassCard>
            );
          })}
        </div>
      </section>
    </CaloriexPage>
  );
}
