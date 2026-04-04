import { GlassCard, GlassMetric } from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";

interface Props {
  activeTabDescription: string;
  activeTabLabel: string;
  formattedDate: string;
  mealLabel: string;
}

export default function FoodSearchHeroAside({
  activeTabDescription,
  activeTabLabel,
  formattedDate,
  mealLabel,
}: Props) {
  return (
    <GlassCard className="hidden overflow-hidden xl:block">
      <CardContent className="space-y-6 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Current focus</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {activeTabLabel}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{activeTabDescription}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <GlassMetric
            label="Meal"
            value={mealLabel}
            description="Selected destination for the next food log."
          />
          <GlassMetric
            label="Date"
            value={formattedDate}
            description="Foods added here will use this diary date."
          />
        </div>
      </CardContent>
    </GlassCard>
  );
}
