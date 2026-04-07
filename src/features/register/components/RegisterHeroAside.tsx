import { GlassCard } from "@/components/caloriex";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import type { RegisterWorkspaceProps } from "../types/register-workspace.types";
import { REGISTER_STEP_COUNT, REGISTER_STEP_META } from "../lib/register.steps";

interface RegisterHeroAsideProps
  extends Pick<RegisterWorkspaceProps, "step" | "canGoNext" | "loading"> {
  roleLabel: string;
}

export default function RegisterHeroAside({
  step,
  canGoNext,
  loading,
  roleLabel,
}: RegisterHeroAsideProps) {
  const activeStep = REGISTER_STEP_META[step - 1];

  return (
    <GlassCard className="overflow-hidden">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
              Onboarding flow
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {roleLabel}
            </h2>
          </div>
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            Step {step}/{REGISTER_STEP_COUNT}
          </Badge>
        </div>

        <div className="cx-glass-block p-4">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
            Current focus
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-950">{activeStep.title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {activeStep.description}
          </p>
        </div>

        <div className="cx-glass-block p-4">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
            Completion status
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-950">
            {loading
              ? "Saving your onboarding data."
              : canGoNext
                ? "This step is ready to continue."
                : "A few required values are still missing."}
          </p>
        </div>
      </CardContent>
    </GlassCard>
  );
}
