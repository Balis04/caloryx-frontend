import {
  CaloriexPage,
  HeroBadge,
  NoticeCard,
  PageHero,
} from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { openCoachCertificate } from "../../lib/coach-profile.certificates";
import {
  formatPriceRange,
  getCurrencyLabel,
  getTrainingFormatLabel,
} from "../../lib/coach-profile.presentation";
import { getCoachProfileValidationState } from "../../lib/coach-profile.validation";
import type { CoachProfileEditorPageProps } from "../../types/coach-profile-editor.types";
import CoachProfileHeroAside from "../shared/CoachProfileHeroAside";
import CoachProfileStatusNotices from "../shared/CoachProfileStatusNotices";
import CoachProfileAvailabilitySection from "./CoachProfileAvailabilitySection";
import CoachProfileCertificatesSection from "./CoachProfileCertificatesSection";
import CoachProfileIntroSection from "./CoachProfileIntroSection";
import CoachProfilePendingCertificatesPanel from "./CoachProfilePendingCertificatesPanel";
import CoachProfilePublicSummaryPanel from "./CoachProfilePublicSummaryPanel";
import CoachProfileSavePanel from "./CoachProfileSavePanel";

export default function CoachProfileEditorWorkspace({
  formData,
  loading,
  saving,
  canSave,
  deletingCertificateId,
  statusMessage,
  errorMessage,
  isForbidden,
  hasCoachProfile,
  pendingCertificates,
  setField,
  setAvailabilityField,
  onFileChange,
  onPendingCertificateChange,
  onPendingCertificatesReset,
  onBackToProfile,
  onCancel,
  onDeleteCertificate,
  onSave,
}: CoachProfileEditorPageProps) {
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
  const pendingCertificatesValid = pendingCertificates.every(
    (certificate) => certificate.certificateName.trim().length > 0
  );
  const validationState = getCoachProfileValidationState(formData);

  const handleSave = async () => {
    const saved = await onSave();

    if (saved) {
      onPendingCertificatesReset();
    }
  };

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

  return (
    <CaloriexPage>
      <PageHero
        leading={
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
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

      <section className="relative container mx-auto px-6 pb-12 md:pb-16">
        <CoachProfileStatusNotices
          errorMessage={errorMessage}
          statusMessage={statusMessage}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_360px]">
          <div className="space-y-6">
            <CoachProfileIntroSection formData={formData} setField={setField} />
            <CoachProfileAvailabilitySection
              availability={formData.availability}
              setAvailabilityField={setAvailabilityField}
            />
            <CoachProfileCertificatesSection
              downloadableCertificates={downloadableCertificates}
              saving={saving}
              deletingCertificateId={deletingCertificateId}
              onFileChange={onFileChange}
              onDownload={openCoachCertificate}
              onDelete={(certificateId) => void onDeleteCertificate(certificateId)}
            />
            <CoachProfilePendingCertificatesPanel
              pendingCertificates={pendingCertificates}
              onPendingCertificateChange={onPendingCertificateChange}
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
              missingFields={validationState.missingFields}
              saving={saving}
              deletingCertificateId={deletingCertificateId}
              pendingCertificatesValid={pendingCertificatesValid}
              onCancel={onCancel}
              onSave={() => void handleSave()}
            />
          </div>
        </div>
      </section>
    </CaloriexPage>
  );
}
