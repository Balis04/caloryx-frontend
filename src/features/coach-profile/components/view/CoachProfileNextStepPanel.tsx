import { AccentButton, GlassCard } from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CoachProfileNextStepPanel({
  onEdit,
}: {
  onEdit: () => void;
}) {
  return (
    <GlassCard className="overflow-hidden">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-cyan-300/50 bg-cyan-100/70 p-3 text-slate-700">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
              Next step
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              Refine your offer
            </h3>
          </div>
        </div>

        <p className="text-sm leading-6 text-slate-600">
          Open the dedicated edit page whenever your schedule, positioning, or pricing
          changes.
        </p>

        <AccentButton tone="sky" onClick={onEdit} className="justify-between">
          <span>Edit coach profile</span>
          <ArrowRight className="h-4 w-4" />
        </AccentButton>
      </CardContent>
    </GlassCard>
  );
}
