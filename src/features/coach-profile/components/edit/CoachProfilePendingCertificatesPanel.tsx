import { SummaryPanel } from "@/components/caloriex";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";
import { coachProfileInputClassName } from "../../lib/coach-profile.presentation";
import type { PendingCoachCertificateUpload } from "../../model/coach-profile.types";

interface CoachProfilePendingCertificatesPanelProps {
  pendingCertificates: PendingCoachCertificateUpload[];
  onPendingCertificateChange: (
    id: string,
    key: keyof Omit<PendingCoachCertificateUpload, "id" | "file">,
    value: string
  ) => void;
}

export default function CoachProfilePendingCertificatesPanel({
  pendingCertificates,
  onPendingCertificateChange,
}: CoachProfilePendingCertificatesPanelProps) {
  const today = new Date().toISOString().split("T")[0];
  const minDate = "1900-01-01";

  return (
    <SummaryPanel eyebrow="Staging" title="Pending certificate uploads" icon={FileText}>
      <div className="space-y-4 p-6">
        {pendingCertificates.length > 0 ? (
          <div className="grid gap-3">
            {pendingCertificates.map((certificate) => (
              <div
                key={certificate.id}
                className="cx-glass-block grid gap-4 rounded-[26px] p-4"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {certificate.certificateName}
                  </p>
                  <p className="text-xs text-slate-500">
                    Source file: {certificate.file.name}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor={`certificate-name-${certificate.id}`}
                      className="text-xs uppercase tracking-[0.24em] text-slate-500"
                    >
                      Certificate name *
                    </Label>
                    <Input
                      id={`certificate-name-${certificate.id}`}
                      value={certificate.certificateName}
                      onChange={(event) =>
                        onPendingCertificateChange(
                          certificate.id,
                          "certificateName",
                          event.target.value
                        )
                      }
                      placeholder="e.g. NASM Certified Coach"
                      className={coachProfileInputClassName}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`certificate-issuer-${certificate.id}`}
                      className="text-xs uppercase tracking-[0.24em] text-slate-500"
                    >
                      Issuer *
                    </Label>
                    <Input
                      id={`certificate-issuer-${certificate.id}`}
                      value={certificate.issuer}
                      onChange={(event) =>
                        onPendingCertificateChange(
                          certificate.id,
                          "issuer",
                          event.target.value
                        )
                      }
                      placeholder="e.g. NASM"
                      className={coachProfileInputClassName}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`certificate-issued-at-${certificate.id}`}
                      className="text-xs uppercase tracking-[0.24em] text-slate-500"
                    >
                      Issued at *
                    </Label>
                    <Input
                      id={`certificate-issued-at-${certificate.id}`}
                      type="date"
                      min={minDate}
                      max={today}
                      value={certificate.issuedAt}
                      onChange={(event) =>
                        onPendingCertificateChange(
                          certificate.id,
                          "issuedAt",
                          event.target.value
                        )
                      }
                      className={coachProfileInputClassName}
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  Every staged certificate must include a name, issuer, and issue date.
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-white/70 bg-white/35 px-4 py-5 text-sm text-slate-500">
            No PDF certificates selected yet.
          </div>
        )}
      </div>
    </SummaryPanel>
  );
}
