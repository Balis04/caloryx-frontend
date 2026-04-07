import { AccentButton, GlassCard } from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CoachProfileCreatePromptPanel({
  onStart,
}: {
  onStart: () => void;
}) {
  return (
    <GlassCard className="overflow-hidden">
      <CardContent className="space-y-4 p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-cyan-300/50 bg-cyan-100/70 p-3 text-slate-700">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
              Next step
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              Open the coach profile editor
            </h2>
          </div>
        </div>

        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          Your public coach page does not exist yet. Create it in the dedicated edit
          screen, then come back here to review the saved version.
        </p>

        <AccentButton
          tone="emerald"
          onClick={onStart}
          className="max-w-sm justify-between"
        >
          <span>Start coach profile setup</span>
          <ArrowRight className="h-4 w-4" />
        </AccentButton>
      </CardContent>
    </GlassCard>
  );
}
