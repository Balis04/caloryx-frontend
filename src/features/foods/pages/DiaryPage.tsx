import { ChevronLeft, ChevronRight, Flame, Target } from "lucide-react";

import { CaloriexPage, GlassMetric, SummaryPanel } from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

import DiaryMealsList from "../components/DiaryMealsList";
import { useDiaryPage } from "../hooks/useDiaryPage";

export default function DiaryPage() {
  const {
    caloriesRemaining,
    meals,
    openMealDetails,
    openMealForAdd,
    progress,
    selectedDate,
    setSelectedDate,
    shiftSelectedDate,
    summary,
    today,
  } = useDiaryPage();

  return (
    <CaloriexPage>
      <section className="relative container mx-auto px-6 pb-12 md:pb-16">
        <SummaryPanel
          eyebrow="Daily summary"
          title="Calories and macros"
          icon={Target}
        >
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

            <div className="rounded-[28px] border border-emerald-200/70 bg-gradient-to-br from-emerald-50/90 via-white/80 to-cyan-50/90 p-5 backdrop-blur">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="grid w-full gap-3 [grid-template-columns:repeat(3,minmax(0,1fr))]">
                  <GlassMetric
                    label="Target"
                    value={`${Math.round(summary.targetCalories)} kcal`}
                    description="Calories already have for the a day."
                  />
                  <GlassMetric
                    label="Consumed"
                    value={`${Math.round(summary.consumedCalories)} kcal`}
                    description="Calories already logged for the selected day."
                  />
                  <GlassMetric
                    label="Remaining"
                    value={`${Math.round(caloriesRemaining)} kcal`}
                    description="Calories still available before reaching your target."
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <GlassMetric
                label="Protein"
                value={`${Math.round(summary.consumedProteinGrams)} g`}
                description={`Goal ${Math.round(summary.targetProteinGrams)} g`}
              />
              <GlassMetric
                label="Carbs"
                value={`${Math.round(summary.consumedCarbohydratesGrams)} g`}
                description={`Goal ${Math.round(
                  summary.targetCarbohydratesGrams
                )} g`}
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
                  <p className="text-sm font-medium text-slate-950">
                    Calorie progress
                  </p>
                  <p className="text-sm text-slate-600">
                    {Math.round(summary.consumedCalories)} consumed of{" "}
                    {Math.round(summary.targetCalories)} kcal
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-3 py-1 text-sm font-medium text-slate-800">
                  <Flame className="h-4 w-4 text-emerald-600" />
                  {Math.round(progress)}%
                </div>
              </div>
              <Progress value={progress} className="h-3 bg-slate-200/80" />
            </div>
          </div>
        </SummaryPanel>

        <DiaryMealsList
          meals={meals}
          onOpenMealDetails={openMealDetails}
          onOpenMealForAdd={openMealForAdd}
        />
      </section>
    </CaloriexPage>
  );
}
