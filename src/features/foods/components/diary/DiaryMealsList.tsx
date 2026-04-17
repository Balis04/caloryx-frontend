import { Plus } from "lucide-react";

import { GlassCard } from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import type { MealTime } from "../../types";

interface DiaryMealItem {
  accent: string;
  mealCalories: { consumed: number; target: number };
  mealProgress: number;
  title: string;
  type: MealTime;
}

interface Props {
  meals: DiaryMealItem[];
  onOpenMealDetails: (mealType: MealTime) => void;
  onOpenMealForAdd: (mealType: MealTime) => void;
}

export default function DiaryMealsList({
  meals,
  onOpenMealDetails,
  onOpenMealForAdd,
}: Props) {
  return (
    <div className="mt-6 grid gap-4">
      {meals.map((meal) => (
        <GlassCard
          key={meal.type}
          role="button"
          tabIndex={0}
          onClick={() => onOpenMealDetails(meal.type)}
          onKeyDown={(event) => {
            if (event.currentTarget !== event.target) {
              return;
            }

            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onOpenMealDetails(meal.type);
            }
          }}
          className="cursor-pointer overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
        >
          <CardContent className="grid gap-5 p-6 md:grid-cols-[minmax(0,1fr)_220px_auto] md:items-center">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`h-12 w-12 rounded-2xl border border-white/70 bg-gradient-to-br ${meal.accent}`}
                />
                <div>
                  <p className="text-xl font-semibold tracking-tight text-slate-950">
                    {meal.title}
                  </p>
                  <p className="text-sm text-slate-600">
                    Open meal details or add a new food item.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>{Math.round(meal.mealCalories.consumed)} kcal</span>
                <span>{Math.round(meal.mealCalories.target)} kcal target</span>
              </div>
              <Progress value={meal.mealProgress} className="h-2.5 bg-slate-200/80" />
            </div>

            <div className="flex items-center justify-end">
              <Button
                size="icon"
                className="h-11 w-11 rounded-full bg-slate-950 text-white hover:bg-slate-800"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenMealForAdd(meal.type);
                }}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </GlassCard>
      ))}
    </div>
  );
}

