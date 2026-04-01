import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CaloriexPage,
  HeroBadge,
  NoticeCard,
  PageHero,
} from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import CoachProfileAvailabilitySection from "../components/CoachProfileAvailabilitySection";
import CoachProfileCertificatesSection from "../components/CoachProfileCertificatesSection";
import CoachProfileHeroAside from "../components/CoachProfileHeroAside";
import CoachProfileIntroSection from "../components/CoachProfileIntroSection";
import CoachProfilePublicSummaryPanel from "../components/CoachProfilePublicSummaryPanel";
import CoachProfileSavePanel from "../components/CoachProfileSavePanel";
import { useCoachProfileForm } from "../hooks/useCoachProfileForm";
import {
  formatPriceRange,
  getCurrencyLabel,
  getTrainingFormatLabel,
} from "../lib/coach-profile.presentation";
import type { CoachCertificate, PendingCoachCertificateUpload } from "../types/coach-profile.types";
import { API_BASE_URL } from "@/lib/api-client";

function openCertificate(certificate: CoachCertificate) {
  if (!certificate.fileUrl) return;

  const fileUrl = /^https?:\/\//i.test(certificate.fileUrl)
    ? certificate.fileUrl
    : `${API_BASE_URL}${certificate.fileUrl.startsWith("/") ? "" : "/"}${certificate.fileUrl}`;

  window.open(fileUrl, "_blank", "noopener,noreferrer");
}

export default function EditCoachProfilePage() {
  const navigate = useNavigate();
  const {
    formData,
    loading,
    saving,
    deletingCertificateId,
    statusMessage,
    errorMessage,
    isForbidden,
    hasCoachProfile,
    setField,
    setAvailabilityField,
    saveCoachProfile,
    deleteCertificate,
    canSave,
  } = useCoachProfileForm();
  const [pendingCertificates, setPendingCertificates] = useState<
    PendingCoachCertificateUpload[]
  >([]);

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

  const handlePdfSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const pdfFiles = files.filter((file) => {
      const isPdfType = file.type === "application/pdf" || !file.type;
      const hasPdfExtension = /\.pdf$/i.test(file.name);
      return isPdfType && hasPdfExtension;
    });

    if (files.length > 0 && pdfFiles.length !== files.length) {
      window.alert("Only PDF files can be uploaded as certificates.");
    }

    const nextCertificates = pdfFiles.map((file, index) => ({
      id: `${file.name}-${file.lastModified}-${index}`,
      file,
      certificateName: file.name.replace(/\.pdf$/i, ""),
      issuer: "",
      issuedAt: "",
    }));

    setPendingCertificates(nextCertificates);
    event.target.value = "";
  };

  const updatePendingCertificate = (
    id: string,
    key: keyof Omit<PendingCoachCertificateUpload, "id" | "file">,
    value: string
  ) => {
    setPendingCertificates((prev) =>
      prev.map((certificate) =>
        certificate.id === id ? { ...certificate, [key]: value } : certificate
      )
    );
  };

  const trainingFormatLabel = getTrainingFormatLabel(formData.sessionFormat);
  const priceRange = formatPriceRange(
    formData.priceFrom,
    formData.priceTo,
    formData.currency
  );
  const pendingCertificatesValid = pendingCertificates.every(
    (certificate) => certificate.certificateName.trim().length > 0
  );

  if (loading) {
    return (
      <CaloriexPage>
        <section className="container mx-auto px-6 py-16">
          <NoticeCard>Loading coach profile editor...</NoticeCard>
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
            onClick={() => navigate("/profile")}
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

  return (
    <CaloriexPage>
      <PageHero
        leading={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(hasCoachProfile ? "/coach-profile" : "/profile")}
            className="w-fit rounded-full border border-white/60 bg-white/55 px-4 text-xs text-slate-600 backdrop-blur hover:bg-white/70 hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            {hasCoachProfile ? "Back to coach profile" : "Back to profile"}
          </Button>
        }
        badge={<HeroBadge>Edit coach profile</HeroBadge>}
        title="Update the public coaching details users rely on before they reach out."
        description="This editing workspace now focuses only on the coach profile form, while the preview lives on its own dedicated page."
        chips={[
          hasCoachProfile ? "Update existing profile" : "Create new profile",
          `${activeAvailability.length} active day${activeAvailability.length === 1 ? "" : "s"}`,
          pendingCertificates.length > 0 ? "Certificates staged" : "No new uploads",
        ]}
        aside={
          <CoachProfileHeroAside
            maxCapacity={formData.maxCapacity}
            trainingFormatLabel={trainingFormatLabel}
            certificateCount={downloadableCertificates.length + pendingCertificates.length}
          />
        }
      />

      <section className="relative container mx-auto px-6 py-12 md:py-16">
        {errorMessage ? <NoticeCard tone="danger" className="mb-6">{errorMessage}</NoticeCard> : null}
        {statusMessage ? <NoticeCard tone="success" className="mb-6">{statusMessage}</NoticeCard> : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_360px]">
          <div className="space-y-6">
            <CoachProfileIntroSection formData={formData} setField={setField} />
            <CoachProfileAvailabilitySection
              availability={formData.availability}
              setAvailabilityField={setAvailabilityField}
            />
            <CoachProfileCertificatesSection
              pendingCertificates={pendingCertificates}
              downloadableCertificates={downloadableCertificates}
              saving={saving}
              deletingCertificateId={deletingCertificateId}
              onFileChange={handlePdfSelection}
              onPendingCertificateChange={updatePendingCertificate}
              onDownload={openCertificate}
              onDelete={(certificateId) => void deleteCertificate(certificateId)}
            />
          </div>

          <div className="space-y-6">
            <CoachProfilePublicSummaryPanel
              description={formData.description}
              startedCoachingAt={formData.startedCoachingAt}
              trainingFormatLabel={trainingFormatLabel}
              priceRange={priceRange}
              maxCapacity={formData.maxCapacity}
              activeAvailability={activeAvailability}
            />

            <CoachProfileSavePanel
              hasCoachProfile={hasCoachProfile}
              pendingCertificateCount={pendingCertificates.length}
              currencyLabel={getCurrencyLabel(formData.currency)}
              canSave={canSave}
              saving={saving}
              deletingCertificateId={deletingCertificateId}
              pendingCertificatesValid={pendingCertificatesValid}
              onCancel={
                hasCoachProfile ? () => navigate("/coach-profile") : () => navigate("/profile")
              }
              onSave={async () => {
                const saved = await saveCoachProfile(pendingCertificates);
                if (saved) {
                  setPendingCertificates([]);
                  navigate("/coach-profile");
                }
              }}
            />
          </div>
        </div>
      </section>
    </CaloriexPage>
  );
}
