import {
  CaloriexPage,
  NoticeCard,
} from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import { openCoachCertificate } from "../../lib/coach-profile.certificates";
import { getCurrencyLabel } from "../../lib/coach-profile.presentation";
import { getCoachProfileValidationState } from "../../lib/coach-profile.validation";
import type {
  AvailabilitySlot,
  CoachProfileFormData,
  PendingCoachCertificateUpload,
} from "../../model/coach-profile.types";
import CoachProfileStatusNotices from "../shared/CoachProfileStatusNotices";
import CoachProfileAvailabilitySection from "./CoachProfileAvailabilitySection";
import CoachProfileCertificatesSection from "./CoachProfileCertificatesSection";
import CoachProfileIntroSection from "./CoachProfileIntroSection";
import CoachProfilePendingCertificatesPanel from "./CoachProfilePendingCertificatesPanel";
import CoachProfileSavePanel from "./CoachProfileSavePanel";

interface CoachProfileEditorFormProps {
  formData: CoachProfileFormData;
  loading: boolean;
  saving: boolean;
  canSave: boolean;
  pendingCertificatesValid: boolean;
  deletingCertificateId: string | null;
  statusMessage: string | null;
  errorMessage: string | null;
  isForbidden: boolean;
  hasCoachProfile: boolean;
  pendingCertificates: PendingCoachCertificateUpload[];
  setField: <K extends keyof CoachProfileFormData>(
    key: K,
    value: CoachProfileFormData[K]
  ) => void;
  setAvailabilityField: (
    day: string,
    key: keyof AvailabilitySlot,
    value: string | boolean
  ) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPendingCertificateChange: (
    id: string,
    key: keyof Omit<PendingCoachCertificateUpload, "id" | "file">,
    value: string
  ) => void;
  onPendingCertificatesReset: () => void;
  onBackToProfile: () => void;
  onCancel: () => void;
  onDeleteCertificate: (certificateId: string) => Promise<boolean>;
  onSave: () => Promise<boolean>;
}

export default function CoachProfileEditorForm({
  formData,
  loading,
  saving,
  canSave,
  pendingCertificatesValid,
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
}: CoachProfileEditorFormProps) {
  const downloadableCertificates = formData.certificates.filter(
    (certificate) => certificate.fileUrl
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
      <section className="relative container mx-auto px-6 pb-12 md:pb-16">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="mb-10 w-fit rounded-full border border-white/60 bg-white/55 px-4 text-xs text-slate-600 backdrop-blur hover:bg-white/70 hover:text-slate-900"
        >
          <ArrowLeft className="mr-2 h-3 w-3" />
          {hasCoachProfile ? "Back to coach profile" : "Back to profile"}
        </Button>

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
