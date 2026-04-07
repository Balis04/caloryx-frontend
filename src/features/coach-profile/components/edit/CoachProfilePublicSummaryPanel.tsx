import { ReadonlyField, SummaryPanel } from "@/components/caloriex";
import { Users } from "lucide-react";

export default function CoachProfilePublicSummaryPanel({
  description,
  startedCoachingAt,
  trainingFormatLabel,
  priceRange,
  maxCapacity,
  activeAvailability,
}: {
  description: string;
  startedCoachingAt: string;
  trainingFormatLabel: string;
  priceRange: string;
  maxCapacity: string;
  activeAvailability: string[];
}) {
  return (
    <SummaryPanel eyebrow="Preview" title="Public summary" icon={Users}>
      <div className="space-y-4 p-6">
        <ReadonlyField
          label="Description"
          value={description}
          fallback="Your introduction will appear here for users."
        />
        <ReadonlyField
          label="Coaching since"
          value={startedCoachingAt}
          fallback="Not specified yet."
        />
        <ReadonlyField
          label="Training type"
          value={trainingFormatLabel}
          fallback="Not specified yet."
        />
        <ReadonlyField label="Price range" value={priceRange} fallback="Not specified yet." />
        <ReadonlyField
          label="Maximum capacity"
          value={maxCapacity ? `${maxCapacity} active clients` : ""}
          fallback="Not specified yet."
        />
        <ReadonlyField
          label="Active days"
          value={activeAvailability.join(", ")}
          fallback="No active days selected yet."
        />
      </div>
    </SummaryPanel>
  );
}
