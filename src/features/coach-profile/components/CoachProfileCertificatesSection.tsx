import type { ChangeEvent } from "react";

import { SummaryPanel } from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileText, Trash2 } from "lucide-react";

import { coachProfileInputClassName } from "../lib/coach-profile.presentation";
import type { CoachCertificate, PendingCoachCertificateUpload } from "../types/coach-profile.types";

export default function CoachProfileCertificatesSection({
  pendingCertificates,
  downloadableCertificates,
  saving,
  deletingCertificateId,
  onFileChange,
  onPendingCertificateChange,
  onDownload,
  onDelete,
}: {
  pendingCertificates: PendingCoachCertificateUpload[];
  downloadableCertificates: CoachCertificate[];
  saving: boolean;
  deletingCertificateId: string | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPendingCertificateChange: (
    id: string,
    key: keyof Omit<PendingCoachCertificateUpload, "id" | "file">,
    value: string
  ) => void;
  onDownload: (certificate: CoachCertificate) => void;
  onDelete: (certificateId: string) => void;
}) {
  return (
    <SummaryPanel eyebrow="Documents" title="Certificates and documents" icon={FileText}>
      <div className="space-y-4 p-6">
        <div className="space-y-2">
          <Label htmlFor="certificates" className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Upload PDF files
          </Label>
          <Input
            id="certificates"
            type="file"
            accept="application/pdf"
            multiple
            onChange={onFileChange}
            className={coachProfileInputClassName}
          />
          <p className="text-xs text-slate-500">
            Upload selected certificate PDFs for your public coach profile.
          </p>
        </div>

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
                    <Label htmlFor={`certificate-name-${certificate.id}`} className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      Certificate name
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
                    <Label htmlFor={`certificate-issuer-${certificate.id}`} className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      Issuer
                    </Label>
                    <Input
                      id={`certificate-issuer-${certificate.id}`}
                      value={certificate.issuer}
                      onChange={(event) =>
                        onPendingCertificateChange(certificate.id, "issuer", event.target.value)
                      }
                      placeholder="e.g. NASM"
                      className={coachProfileInputClassName}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`certificate-issued-at-${certificate.id}`} className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      Issued at
                    </Label>
                    <Input
                      id={`certificate-issued-at-${certificate.id}`}
                      type="date"
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
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-white/70 bg-white/35 px-4 py-5 text-sm text-slate-500">
            No PDF certificates selected yet.
          </div>
        )}

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Uploaded certificates
          </p>
          {downloadableCertificates.length > 0 ? (
            <div className="grid gap-3">
              {downloadableCertificates.map((certificate) => (
                <div
                  key={certificate.id}
                  className="cx-glass-block flex items-center justify-between gap-3 rounded-[22px] px-4 py-3"
                >
                  <div className="min-w-0 text-sm">
                    <p className="truncate font-medium text-slate-900">
                      {certificate.certificateName}
                    </p>
                    {certificate.issuer || certificate.issuedAt ? (
                      <p className="truncate text-xs text-slate-500">
                        {[certificate.issuer, certificate.issuedAt].filter(Boolean).join(" | ")}
                      </p>
                    ) : null}
                  </div>

                  <div className="ml-auto flex shrink-0 items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onDownload(certificate)}
                      disabled={saving || deletingCertificateId === certificate.id}
                      className="gap-2 rounded-full border-white/70 bg-white/70"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(certificate.id)}
                      disabled={saving || deletingCertificateId !== null}
                      className="gap-2 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingCertificateId === certificate.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-white/70 bg-white/35 px-4 py-5 text-sm text-slate-500">
              No uploaded certificates are available for this profile yet.
            </div>
          )}
        </div>
      </div>
    </SummaryPanel>
  );
}
