import { AccentButton, GlassCard } from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { ArrowRight, Save } from "lucide-react";

export default function CoachProfileSavePanel({
  hasCoachProfile,
  canSave,
  saving,
  deletingCertificateId,
  pendingCertificatesValid,
  onCancel,
  onSave,
}: {
  hasCoachProfile: boolean;
  canSave: boolean;
  saving: boolean;
  deletingCertificateId: string | null;
  pendingCertificatesValid: boolean;
  onCancel?: () => void;
  onSave: () => void;
}) {
  return (
    <GlassCard className="overflow-hidden">
      <CardContent className="space-y-4 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Save flow</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Publish your coach profile
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Keep your public summary, availability, and supporting documents in sync
            before users start sending requests.
          </p>
        </div>

        <div className="space-y-3">
          {onCancel ? (
            <Button
              variant="outline"
              onClick={onCancel}
              className="w-full rounded-2xl border-white/70 bg-white/70"
            >
              Cancel
            </Button>
          ) : null}

          <AccentButton
            tone={canSave ? "emerald" : "sky"}
            onClick={onSave}
            disabled={
              !canSave || saving || deletingCertificateId !== null || !pendingCertificatesValid
            }
            className="justify-between"
          >
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {saving
                ? "Saving..."
                : canSave && pendingCertificatesValid
                  ? hasCoachProfile
                    ? "Save changes"
                    : "Create coach profile"
                  : "Complete required fields"}
            </span>
            <ArrowRight className="h-4 w-4" />
          </AccentButton>
        </div>
      </CardContent>
    </GlassCard>
  );
}
