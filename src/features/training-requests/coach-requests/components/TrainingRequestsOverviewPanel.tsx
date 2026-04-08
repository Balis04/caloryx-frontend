import { ClipboardList } from "lucide-react";

import { GlassMetric, SummaryPanel } from "@/components/caloriex";

export default function TrainingRequestsOverviewPanel({
  showCoachIncomingRequests,
}: {
  showCoachIncomingRequests: boolean;
}) {
  return (
    <SummaryPanel eyebrow="Overview" title="Request flow" icon={ClipboardList} className="hidden xl:block">
      <div className="space-y-4 p-6">
        <GlassMetric label="Mode" value={showCoachIncomingRequests ? "Coach" : "User"} description="Controls whether you are reviewing incoming work or tracking sent requests." />
        <GlassMetric label="Review" value={showCoachIncomingRequests ? "Approve or reject" : "Follow status"} description="The action set changes based on your active perspective." />
        <GlassMetric label="Plan delivery" value="Upload then download" description="Approved requests can move into plan upload and completed requests support download." />
      </div>
    </SummaryPanel>
  );
}
