import { GlassCard, GlassMetric } from "@/components/caloriex";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";

export default function CoachProfileOverviewCard({
  trainingFormatLabel,
  priceRange,
  activeDayCount,
}: {
  trainingFormatLabel: string;
  priceRange: string;
  activeDayCount: number;
}) {
  return (
    <GlassCard className="overflow-hidden border-white/70">
      <div className="border-b border-white/60 bg-gradient-to-r from-sky-100/80 via-white/40 to-emerald-100/80 p-6 md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className="border-sky-300/60 bg-white/70 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-700"
              >
                Coach profile
              </Badge>
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                Completed
              </Badge>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                Public coaching profile
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                This is the summary users see when evaluating whether to work with you.
              </p>
            </div>
          </div>

          <div className="cx-glass-block rounded-[28px] p-5 lg:max-w-xs">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
              Live profile status
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">Ready</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Your coach-facing details are already saved and available to edit.
            </p>
          </div>
        </div>
      </div>

      <CardContent className="grid gap-4 p-6 md:grid-cols-3 md:p-8">
        <GlassMetric
          label="Format"
          value={trainingFormatLabel}
          description="Main delivery style shown to users."
        />
        <GlassMetric
          label="Price range"
          value={priceRange}
          description="Displayed pricing envelope for your service."
        />
        <GlassMetric
          label="Active days"
          value={`${activeDayCount}`}
          description="Days where users can expect coaching availability."
        />
      </CardContent>
    </GlassCard>
  );
}
