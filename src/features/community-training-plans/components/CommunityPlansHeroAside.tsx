import { Orbit } from "lucide-react";

import { GlassMetric, SummaryPanel } from "@/components/caloriex";

import { getCommunityPlanCountLabel } from "../lib/community-training-plans.presentation";
import type { CommunityPlansHeroAsideProps } from "../types/community-training-plans.types";

export default function CommunityPlansHeroAside({
  planCount,
}: CommunityPlansHeroAsideProps) {
  return (
    <SummaryPanel eyebrow="Signal board" title="Public plan library" icon={Orbit}>
      <div className="grid gap-4 p-6 sm:grid-cols-2">
        <GlassMetric
          label="Plans"
          value={getCommunityPlanCountLabel(planCount)}
          description="Maintenance, fat loss, and muscle gain plans."
        />
        <GlassMetric
          label="Access"
          value="Instant"
          description="Download a PDF immediately and start training."
        />
      </div>
    </SummaryPanel>
  );
}
