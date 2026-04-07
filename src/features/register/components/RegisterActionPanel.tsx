import {
  AccentButton,
  NoticeCard,
  ReadonlyField,
  SummaryPanel,
} from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import type { RegisterWorkspaceProps } from "../types/register-workspace.types";
import { REGISTER_STEP_COUNT } from "../lib/register.steps";

interface RegisterActionPanelProps
  extends Pick<
    RegisterWorkspaceProps,
    "step" | "values" | "canGoNext" | "loading" | "error" | "onBack" | "onNext" | "onFinish"
  > {
  roleLabel: string;
}

export default function RegisterActionPanel({
  step,
  values,
  canGoNext,
  loading,
  error,
  onBack,
  onNext,
  onFinish,
  roleLabel,
}: RegisterActionPanelProps) {
  const isLastStep = step === REGISTER_STEP_COUNT;

  return (
    <SummaryPanel eyebrow="Review" title="Move through onboarding" icon={Sparkles}>
      <div className="space-y-4 p-6">
        <ReadonlyField label="Draft name" value={values.fullName} fallback="Add your full name" />
        <ReadonlyField label="Role" value={roleLabel} fallback="Choose your role" />
        <ReadonlyField
          label="Step status"
          value={canGoNext ? "Ready to continue" : ""}
          fallback="Complete required inputs"
        />

        {error ? <NoticeCard tone="danger">{error}</NoticeCard> : null}

        {step > 1 ? (
          <Button
            variant="ghost"
            onClick={onBack}
            disabled={loading}
            className="w-full justify-between rounded-2xl border border-white/60 bg-white/55 px-4 text-slate-700 backdrop-blur hover:bg-white/70 hover:text-slate-950"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Previous step
            </span>
            <span className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Step {step - 1}
            </span>
          </Button>
        ) : null}

        <AccentButton
          tone={canGoNext ? "emerald" : "sky"}
          onClick={isLastStep ? onFinish : onNext}
          disabled={!canGoNext || loading}
          className="justify-between"
        >
          <span className="flex items-center gap-2">
            {isLastStep ? <CheckCircle2 className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            {loading
              ? "Saving..."
              : isLastStep
                ? "Finish registration"
                : "Continue to next step"}
          </span>
          <span className="text-xs uppercase tracking-[0.24em]">
            {isLastStep ? "Complete" : `Step ${step + 1}`}
          </span>
        </AccentButton>
      </div>
    </SummaryPanel>
  );
}
