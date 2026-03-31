import { ArrowRightLeft } from "lucide-react";

import { GlassMetric, SummaryPanel } from "@/components/caloriex";

export default function TrainingRequestHeroAside({
  coachName,
  canSubmit,
}: {
  coachName?: string | null;
  canSubmit: boolean;
}) {
  return (
    <SummaryPanel eyebrow="Request status" title="Ready to send" icon={ArrowRightLeft}>
      <div className="grid gap-4 p-6 sm:grid-cols-2">
        <GlassMetric
          label="Coach"
          value={coachName ? "Linked" : "Missing"}
          description={
            coachName
              ? `${coachName} is attached to this request.`
              : "Go back and select a coach first."
          }
        />
        <GlassMetric
          label="Submit"
          value={canSubmit ? "Ready" : "Draft"}
          description="Complete the required fields to enable sending."
        />
      </div>
    </SummaryPanel>
  );
}
