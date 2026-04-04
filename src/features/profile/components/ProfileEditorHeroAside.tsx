import { GlassCard } from "@/components/caloriex";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import type { ProfileEditorHeroAsideProps } from "./profile-editor.types";

export default function ProfileEditorHeroAside({
  roleLabel,
  canSave,
}: ProfileEditorHeroAsideProps) {
  return (
    <GlassCard className="overflow-hidden">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
              Editing mode
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {roleLabel}
            </h2>
          </div>
          <Badge variant="secondary" className="rounded-full px-3 py-1 capitalize">
            {canSave ? "Ready" : "Incomplete"}
          </Badge>
        </div>

        <div className="cx-glass-block p-4">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
            Save status
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-950">
            {canSave
              ? "All required values are in place."
              : "Some required values are missing."}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Keep your profile accurate so calorie targets, training requests, and
            coaching flows stay aligned.
          </p>
        </div>
      </CardContent>
    </GlassCard>
  );
}
