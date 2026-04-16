import { GlassCard, GlassMetric } from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";
import { coachRequestFilterLabelMap } from "../lib/coach-training-requests.utils";
import type { CoachRequestFilter } from "../model/coach-training-request.model";

export default function TrainingRequestsHeroAside({
  coachRequestFilter,
  showCoachIncomingRequests,
  visibleCount,
}: {
  coachRequestFilter: CoachRequestFilter;
  showCoachIncomingRequests: boolean;
  visibleCount: number;
}) {
  return (
    <GlassCard className="hidden overflow-hidden xl:block">
      <CardContent className="space-y-5 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Current mode</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {showCoachIncomingRequests ? "Coach review" : "User tracking"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Switch between incoming coach work and your personal request history without losing
            context.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <GlassMetric label="Visible" value={String(visibleCount)} description="Requests currently shown under the selected view." />
          <GlassMetric label="Filter" value={showCoachIncomingRequests ? coachRequestFilterLabelMap[coachRequestFilter] : "History"} description="Current request list grouping." />
        </div>
      </CardContent>
    </GlassCard>
  );
}
