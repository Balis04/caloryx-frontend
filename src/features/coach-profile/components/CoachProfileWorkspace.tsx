import { CaloriexPage, NoticeCard } from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import { openCoachCertificate } from "../lib/coach-profile.certificates";
import {
  formatPriceRange,
  getTrainingFormatLabel,
} from "../lib/coach-profile.presentation";
import type { CoachProfileWorkspaceProps } from "../types/coach-profile-workspace.types";
import CoachProfileCreateWorkspace from "./create/CoachProfileCreateWorkspace";
import CoachProfileViewWorkspace from "./view/CoachProfileViewWorkspace";

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
  const downloadableCertificates = useMemo(
    () => formData.certificates.filter((certificate) => certificate.fileUrl),
    [formData.certificates]
  );

  const activeAvailability = useMemo(
    () =>
      formData.availability
        .filter((slot) => slot.enabled)
        .map((slot) => `${slot.label} ${slot.from}-${slot.until}`),
    [formData.availability]
  );

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
