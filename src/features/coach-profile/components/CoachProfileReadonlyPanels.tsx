import { ReadonlyField, SummaryPanel } from "@/components/caloriex";
import { FileText, Shield, Users } from "lucide-react";

import type { CoachCertificate } from "../types/coach-profile.types";

export function CoachProfileOfferPanel({
  startedCoachingAt,
  trainingFormatLabel,
  maxCapacity,
  priceRange,
}: {
  startedCoachingAt: string;
  trainingFormatLabel: string;
  maxCapacity: string;
  priceRange: string;
}) {
  return (
    <SummaryPanel eyebrow="Offer" title="Basic information" icon={Shield}>
      <div className="grid gap-4 p-6 md:grid-cols-2">
        <ReadonlyField label="Coaching since" value={startedCoachingAt} fallback="-" />
        <ReadonlyField label="Training format" value={trainingFormatLabel} fallback="-" />
        <ReadonlyField
          label="Capacity"
          value={maxCapacity ? `${maxCapacity} active clients` : ""}
          fallback="-"
        />
        <ReadonlyField label="Price range" value={priceRange} fallback="-" />
      </div>
    </SummaryPanel>
  );
}

export function CoachProfilePublicInfoPanel({
  description,
  contactNote,
  activeAvailability,
}: {
  description: string;
  contactNote: string;
  activeAvailability: string[];
}) {
  return (
    <SummaryPanel eyebrow="Public info" title="What users will read" icon={Users}>
      <div className="grid gap-4 p-6">
        <ReadonlyField label="Description" value={description} fallback="-" />
        <ReadonlyField label="Contact note" value={contactNote} fallback="-" />
        <ReadonlyField
          label="Active days"
          value={activeAvailability.join(", ")}
          fallback="-"
        />
      </div>
    </SummaryPanel>
  );
}

export function CoachProfileCertificatesPanel({
  certificates,
  onDownload,
}: {
  certificates: CoachCertificate[];
  onDownload: (certificate: CoachCertificate) => void;
}) {
  return (
    <SummaryPanel eyebrow="Documents" title="Certificates" icon={FileText}>
      <div className="space-y-3 p-6">
        {certificates.length > 0 ? (
          certificates.map((certificate) => (
            <button
              key={certificate.id}
              type="button"
              onClick={() => onDownload(certificate)}
              className="cx-glass-block flex w-full items-center justify-between gap-3 rounded-[22px] px-4 py-3 text-left text-sm transition-transform hover:-translate-y-0.5"
            >
              <span className="truncate font-medium text-slate-900">
                {certificate.certificateName}
              </span>
              <FileText className="h-4 w-4 shrink-0 text-slate-500" />
            </button>
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-white/70 bg-white/35 px-4 py-5 text-sm text-slate-500">
            No certificates uploaded yet.
          </div>
        )}
      </div>
    </SummaryPanel>
  );
}
