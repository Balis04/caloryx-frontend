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

export interface CoachProfileAvailabilityDto {
  dayOfWeek?: string;
  available?: boolean;
  startTime?: string | null;
  endTime?: string | null;
}

export interface CoachCertificateResponseDto {
  id: string;
  certificateName?: string | null;
  issuer?: string | null;
  issuedAt?: string | null;
  fileName?: string | null;
  fileUrl?: string | null;
}

export type CoachProfileCertificateDto =
  | string
  | {
      id?: string;
      certificateName?: string | null;
      issuer?: string | null;
      issuedAt?: string | null;
      fileName?: string | null;
      fileUrl?: string | null;
    };

export interface CoachProfileResponseDto {
  id: string;
  trainingStartedAt: string | null;
  shortDescription: string | null;
  trainingFormat: TrainingFormat | "";
  priceFrom: number | null;
  priceTo: number | null;
  currency: Currency | "";
  maxCapacity: number | null;
  contactNote: string | null;
  availabilities?: CoachProfileAvailabilityDto[];
  certificates?: CoachProfileCertificateDto[];
}

export interface SaveCoachProfileAvailabilityRequestDto {
  dayOfWeek: string;
  available: boolean;
  startTime: string | null;
  endTime: string | null;
}

export interface SaveCoachProfileRequestDto {
  trainingStartedAt: string;
  shortDescription: string;
  trainingFormat: TrainingFormat | "";
  priceFrom: number | null;
  priceTo: number | null;
  currency: Currency | "" | null;
  maxCapacity: number;
  contactNote: string | null;
  availabilities: SaveCoachProfileAvailabilityRequestDto[];
  certificates: CoachProfileCertificateDto[];
}
