import { CaloriexPage, NoticeCard } from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { openCoachCertificate } from "../lib/coach-profile.certificates";
import {
  formatPriceRange,
  getTrainingFormatLabel,
} from "../lib/coach-profile.presentation";
import CoachProfileCreateWorkspace from "./create/CoachProfileCreateWorkspace";
import CoachProfileViewWorkspace from "./view/CoachProfileViewWorkspace";

import type { CoachProfileFormData } from "../model/coach-profile.types";

interface CoachProfileWorkspaceProps {
  formData: CoachProfileFormData;
  loading: boolean;
  errorMessage: string | null;
  statusMessage: string | null;
  isForbidden: boolean;
  hasCoachProfile: boolean;
  onBackToProfile: () => void;
  onOpenEditor: () => void;
}

export default function CoachProfileWorkspace({
  formData,
  loading,
  errorMessage,
  statusMessage,
  isForbidden,
  hasCoachProfile,
  onBackToProfile,
  onOpenEditor,
}: CoachProfileWorkspaceProps) {
  const downloadableCertificates = formData.certificates.filter(
    (certificate) => certificate.fileUrl
  );
  const activeAvailability = formData.availability
    .filter((slot) => slot.enabled)
    .map((slot) => `${slot.label} ${slot.from}-${slot.until}`);

  const trainingFormatLabel = getTrainingFormatLabel(formData.sessionFormat);
  const priceRange = formatPriceRange(
    formData.priceFrom,
    formData.priceTo,
    formData.currency
  );

  if (loading) {
    return (
      <CaloriexPage>
        <section className="container mx-auto px-6 py-16">
          <NoticeCard>Loading coach profile workspace...</NoticeCard>
        </section>
      </CaloriexPage>
    );
  }

  if (isForbidden) {
    return (
      <CaloriexPage>
        <section className="container mx-auto px-6 py-16">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToProfile}
            className="mb-4 w-fit rounded-full border border-white/60 bg-white/55 px-4 text-xs text-slate-600 backdrop-blur hover:bg-white/70 hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            Back to profile
          </Button>
          <NoticeCard tone="danger">{errorMessage ?? "Forbidden"}</NoticeCard>
        </section>
      </CaloriexPage>
    );
  }

  if (!hasCoachProfile) {
    return (
      <CoachProfileCreateWorkspace
        maxCapacity={formData.maxCapacity}
        trainingFormatLabel={trainingFormatLabel}
        certificateCount={downloadableCertificates.length}
        errorMessage={errorMessage}
        statusMessage={statusMessage}
        onBackToProfile={onBackToProfile}
        onOpenEditor={onOpenEditor}
      />
    );
  }

  return (
    <CoachProfileViewWorkspace
      maxCapacity={formData.maxCapacity}
      trainingFormatLabel={trainingFormatLabel}
      certificateCount={downloadableCertificates.length}
      activeAvailability={activeAvailability}
      downloadableCertificates={downloadableCertificates}
      startedCoachingAt={formData.startedCoachingAt}
      priceRange={priceRange}
      description={formData.description}
      contactNote={formData.contactNote}
      errorMessage={errorMessage}
      statusMessage={statusMessage}
      onBackToProfile={onBackToProfile}
      onOpenEditor={onOpenEditor}
      onDownloadCertificate={openCoachCertificate}
    />
  );
}
