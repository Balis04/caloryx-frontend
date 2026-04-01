import { GlassCard, GlassMetric } from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";

export default function CoachProfileHeroAside({
  maxCapacity,
  trainingFormatLabel,
  certificateCount,
}: {
  maxCapacity: string;
  trainingFormatLabel: string;
  certificateCount: number;
}) {
  return (
    <GlassCard className="overflow-hidden">
      <CardContent className="grid gap-4 p-6">
        <GlassMetric
          label="Capacity"
          value={maxCapacity ? maxCapacity : "-"}
          description="Maximum active clients you want to handle."
        />
        <GlassMetric
          label="Format"
          value={trainingFormatLabel}
          description="How your sessions are typically delivered."
        />
        <GlassMetric
          label="Certificates"
          value={`${certificateCount}`}
          description="Uploaded or currently staged proof documents."
        />
      </CardContent>
    </GlassCard>
  );
}
