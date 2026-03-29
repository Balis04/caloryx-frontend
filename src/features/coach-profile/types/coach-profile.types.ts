export type TrainingFormat = "ONLINE" | "HYBRID" | "IN_PERSON";
export type Currency = "HUF" | "EUR" | "USD";

export interface AvailabilitySlot {
  dayOfWeek: string;
  label: string;
  enabled: boolean;
  from: string;
  until: string;
}

export interface CoachCertificate {
  id: string;
  certificateName: string;
  issuer: string;
  issuedAt: string;
  fileName: string;
  fileUrl: string;
}

export interface PendingCoachCertificateUpload {
  id: string;
  file: File;
  certificateName: string;
  issuer: string;
  issuedAt: string;
}

export interface CoachProfileFormData {
  description: string;
  startedCoachingAt: string;
  maxCapacity: string;
  sessionFormat: TrainingFormat | "";
  priceFrom: string;
  priceTo: string;
  currency: Currency | "";
  contactNote: string;
  certificates: CoachCertificate[];
  availability: AvailabilitySlot[];
}
