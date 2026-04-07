import { GlassCard, ReadonlyField } from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import type { ProfileEditorSnapshotPanelProps } from "../types/profile-editor.types";

export default function ProfileEditorSnapshotPanel({
  values,
}: ProfileEditorSnapshotPanelProps) {
  return (
    <GlassCard className="overflow-hidden">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-cyan-300/50 bg-cyan-100/70 p-3 text-slate-700">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
              Live snapshot
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              Current draft
            </h3>
          </div>
        </div>

        <div className="grid gap-3">
          <ReadonlyField
            label="Current weight"
            value={values.actualWeightKg ? `${values.actualWeightKg} kg` : ""}
            fallback="Add current weight"
          />
          <ReadonlyField
            label="Target weight"
            value={values.targetWeightKg ? `${values.targetWeightKg} kg` : ""}
            fallback="Add target weight"
          />
          <ReadonlyField
            label="Weekly target"
            value={values.weeklyGoalKg ? `${values.weeklyGoalKg} kg` : ""}
            fallback="Add weekly target"
          />
        </div>
      </CardContent>
    </GlassCard>
  );
}
