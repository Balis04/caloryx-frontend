import { CalendarDays, ChevronLeft, ChevronRight, Target } from "lucide-react";

import {
  CaloriexPage,
  GlassMetric,
  HeroBadge,
  PageHero,
  SummaryPanel,
} from "@/components/caloriex";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

import type { DiaryWorkspaceProps } from "../../types/foods.types";
import DiaryHeroAside from "./DiaryHeroAside";
import DiaryMealsList from "./DiaryMealsList";

export default function DiaryWorkspace({ diary }: DiaryWorkspaceProps) {
  const {
    caloriesRemaining,
    formattedSelectedDate,
    isLoadingSummary,
    meals,
    openMealDetails,
    openMealForAdd,
    progress,
    selectedDate,
    setSelectedDate,
    shiftSelectedDate,
    summary,
    summaryError,
    today,
  } = diary;

  return (
    <CaloriexPage>
      <PageHero
        badge={<HeroBadge>Diary overview</HeroBadge>}
        title="Track the whole day in one place, then jump into any meal to log details."
        description="The foods package now uses the same refreshed CalorieX page system, so summary panels, meal cards, and action areas stay visually consistent."
        chips={[
          formattedSelectedDate,
          isLoadingSummary ? "Refreshing summary" : "Daily snapshot",
          "Meal-first logging",
        ]}
        aside={
          <DiaryHeroAside
            caloriesRemaining={caloriesRemaining}
            consumedCalories={summary.consumedCalories}
            formattedSelectedDate={formattedSelectedDate}
            isLoadingSummary={isLoadingSummary}
            targetCalories={summary.targetCalories}
          />
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
                  onClick={() => shiftSelectedDate(-1)}
                  aria-label="Previous day"
                  className="rounded-full border-white/70 bg-white/70"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(event) => {
                    if (event.target.value) {
                      setSelectedDate(event.target.value);
                    }
                  }}
                  className="max-w-[210px] border-white/70 bg-white/75"
                />

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => shiftSelectedDate(1)}
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
                      {Math.round(summary.consumedCalories)} consumed of{" "}
                      {Math.round(summary.targetCalories)} kcal
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
              <p>
                Pick a date, review the totals, then open a meal card to inspect foods or add
                new ones.
              </p>
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

        <DiaryMealsList
          meals={meals}
          onOpenMealDetails={openMealDetails}
          onOpenMealForAdd={openMealForAdd}
        />
      </section>
    </CaloriexPage>
  );
}
