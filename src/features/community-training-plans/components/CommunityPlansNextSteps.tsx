import { Orbit } from "lucide-react";

import { SummaryPanel } from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";

export default function CommunityPlansNextSteps() {
  return (
    <SummaryPanel
      eyebrow="Community downloads"
      title="Start with a ready-made plan, then move to a custom one when you need more."
      icon={Orbit}
    >
      <CardContent className="grid gap-8 p-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div className="space-y-4">
          <p className="max-w-2xl text-base leading-8 text-slate-600">
            These community PDFs are a quick entry point for users who want structure right
            away. They work well as a starting layer before choosing a coach and requesting a
            more personalized training plan.
          </p>
        </div>

        <div className="grid gap-3">
          <div className="cx-glass-block rounded-[24px] p-4 text-sm text-slate-700">
            Maintenance: balanced volume for steady performance and recovery.
          </div>
          <div className="cx-glass-block rounded-[24px] p-4 text-sm text-slate-700">
            Weight loss: higher output and structure for deficit phases.
          </div>
          <div className="cx-glass-block rounded-[24px] p-4 text-sm text-slate-700">
            Bulk: extra workload and progression focus for muscle gain phases.
          </div>
        </div>
      </CardContent>
    </SummaryPanel>
  );
}
