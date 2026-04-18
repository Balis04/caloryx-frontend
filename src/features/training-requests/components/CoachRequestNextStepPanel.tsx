import { ArrowRight, Send } from "lucide-react";

import { AccentButton, SummaryPanel } from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";

import type { CoachCardData } from "@/features/training-requests/types";

export default function CoachRequestNextStepPanel({
  selectedCoach,
  actionLabel = "Open training request form",
  description,
  disabled,
  loading,
  title = "Open the request form",
  onAction,
}: {
  selectedCoach: CoachCardData | null;
  actionLabel?: string;
  description?: string;
  disabled?: boolean;
  loading?: boolean;
  title?: string;
  onAction: () => void;
}) {
  const isSubmitAction = actionLabel.toLowerCase().includes("send");

  return (
    <SummaryPanel
      eyebrow="Next step"
      title={title}
      icon={ArrowRight}
      className="h-fit lg:sticky lg:top-6"
    >
      <CardContent className="space-y-5 p-6">
        <p className="text-sm leading-7 text-slate-600">
          {description ??
            "Continue with the selected coach and fill in the details of the training plan you want to receive."}
        </p>
        {selectedCoach ? (
          <>
            <div className="cx-glass-block rounded-[24px] p-4 text-sm text-slate-700">
              <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                Selected coach
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {selectedCoach.fullName}
              </p>
              <p className="mt-1 text-slate-600">{selectedCoach.email}</p>
            </div>
            <div className="cx-glass-block rounded-[24px] p-4 text-sm text-slate-600">
              On the next page, your request will be linked to this coach profile so you
              can send your details, preferences, and short description in one step.
            </div>
          </>
        ) : (
          <div className="rounded-[24px] border border-dashed border-white/70 bg-white/55 p-4 text-sm text-slate-600 backdrop-blur">
            Select a coach card first to unlock the training request form.
          </div>
        )}

        <AccentButton
          tone="sky"
          disabled={!selectedCoach || disabled || loading}
          onClick={onAction}
        >
          {isSubmitAction ? <Send className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          {loading ? "Sending..." : actionLabel}
        </AccentButton>
      </CardContent>
    </SummaryPanel>
  );
}

