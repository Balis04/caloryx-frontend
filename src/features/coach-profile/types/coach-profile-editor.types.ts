import type { ChangeEvent } from "react";
import type {
  AvailabilitySlot,
  CoachCertificate,
  CoachProfileFormData,
  PendingCoachCertificateUpload,
} from "./coach-profile.types";

export interface CoachProfileEditorPageProps {
  formData: CoachProfileFormData;
  loading: boolean;
  saving: boolean;
  canSave: boolean;
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
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
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

export interface CoachProfileStatusNoticesProps {
  errorMessage: string | null;
  statusMessage: string | null;
}

export interface CoachProfilePendingCertificatesPanelProps {
  pendingCertificates: PendingCoachCertificateUpload[];
  onPendingCertificateChange: (
    id: string,
    key: keyof Omit<PendingCoachCertificateUpload, "id" | "file">,
    value: string
  ) => void;
}

export interface CoachProfileCertificatesSectionProps {
  downloadableCertificates: CoachCertificate[];
  saving: boolean;
  deletingCertificateId: string | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDownload: (certificate: CoachCertificate) => void;
  onDelete: (certificateId: string) => void;
}
