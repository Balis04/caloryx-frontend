import type { CoachProfileFormData } from "../types/coach-profile.types";

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
  trainingFormat: CoachProfileFormData["sessionFormat"];
  priceFrom: number | null;
  priceTo: number | null;
  currency: CoachProfileFormData["currency"];
  maxCapacity: number | null;
  contactNote: string | null;
  availabilities?: CoachProfileAvailabilityDto[];
  certificates?: CoachProfileCertificateDto[];
}

export interface SaveCoachProfileRequestDto {
  trainingStartedAt: string;
  shortDescription: string;
  trainingFormat: CoachProfileFormData["sessionFormat"];
  priceFrom: number | null;
  priceTo: number | null;
  currency: CoachProfileFormData["currency"] | null;
  maxCapacity: number;
  contactNote: string | null;
  availabilities: Array<{
    dayOfWeek: string;
    available: boolean;
    startTime: string | null;
    endTime: string | null;
  }>;
  certificates: [];
}
