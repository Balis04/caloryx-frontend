import { GlassCard, GlassMetric } from "@/components/caloriex";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";

interface Props {
  caloriesRemaining: number;
  consumedCalories: number;
  formattedSelectedDate: string;
  isLoadingSummary: boolean;
  targetCalories: number;
}

export default function DiaryHeroAside({
  caloriesRemaining,
  consumedCalories,
  formattedSelectedDate,
  isLoadingSummary,
  targetCalories,
}: Props) {
  return (
    <GlassCard className="hidden overflow-hidden xl:block">
      <CardContent className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Selected date</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {formattedSelectedDate}
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
            value={`${Math.round(consumedCalories)} kcal`}
            description={
              isLoadingSummary
                ? "Loading current daily intake."
                : "Current total for the selected day."
            }
          />
          <GlassMetric
            label="Target"
            value={`${Math.round(targetCalories)} kcal`}
            description="Daily calorie goal used for progress tracking."
          />
        </div>
      </CardContent>
    </GlassCard>
  );
}
