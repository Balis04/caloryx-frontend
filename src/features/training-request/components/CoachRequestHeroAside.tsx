import { Users } from "lucide-react";

import { GlassMetric, SummaryPanel } from "@/components/caloriex";

export default function CoachRequestHeroAside({
  coachCount,
  selectedCoachName,
}: {
  coachCount: number;
  selectedCoachName?: string | null;
}) {
  return (
    <SummaryPanel eyebrow="Request flow" title="Start a custom plan" icon={Users}>
      <div className="grid gap-4 p-6 sm:grid-cols-2">
        <GlassMetric
          label="Coaches"
          value={String(coachCount).padStart(2, "0")}
          description="Available profiles you can request a plan from."
        />
        <GlassMetric
          label="Next step"
          value={selectedCoachName ? "Ready" : "Choose"}
          description={
            selectedCoachName
              ? `Selected coach: ${selectedCoachName}`
              : "Select a coach card to continue to the request form."
          }
        />
      </div>
    </SummaryPanel>
  );
}
