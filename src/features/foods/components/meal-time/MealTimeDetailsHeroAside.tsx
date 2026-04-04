import { Plus } from "lucide-react";

import { GlassCard, GlassMetric } from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

interface Props {
  consumedCalories: number;
  formattedDate: string;
  foodsCount: number;
  mealTitle: string;
  onAddFood: () => void;
  targetCalories: number;
}

export default function MealTimeDetailsHeroAside({
  consumedCalories,
  foodsCount,
  formattedDate,
  mealTitle,
  onAddFood,
  targetCalories,
}: Props) {
  return (
    <GlassCard className="hidden overflow-hidden xl:block">
      <CardContent className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Meal snapshot</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {Math.round(consumedCalories)} kcal
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Current total for {mealTitle.toLowerCase()} on {formattedDate}.
            </p>
          </div>
          <Button onClick={onAddFood} className="rounded-full px-5">
            <Plus className="mr-2 h-4 w-4" />
            Add food
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <GlassMetric
            label="Logged items"
            value={String(foodsCount)}
            description="Foods currently included in this meal."
          />
          <GlassMetric
            label="Target"
            value={`${Math.round(targetCalories)} kcal`}
            description="Calorie target assigned to this meal."
          />
        </div>
      </CardContent>
    </GlassCard>
  );
}
