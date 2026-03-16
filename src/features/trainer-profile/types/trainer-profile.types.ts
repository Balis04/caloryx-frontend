export type TrainingFormat = "ONLINE" | "HYBRID" | "IN_PERSON";
export type Currency = "HUF" | "EUR" | "USD";

export interface AvailabilitySlot {
  dayOfWeek: string;
  label: string;
  enabled: boolean;
  from: string;
  until: string;
}

export interface TrainerCertificate {
  id: string;
  certificateName: string;
  issuer: string;
  issuedAt: string;
  fileName: string;
  fileUrl: string;
}

export interface TrainerProfileFormData {
  description: string;
  startedCoachingAt: string;
  maxCapacity: string;
  sessionFormat: TrainingFormat | "";
  priceFrom: string;
  priceTo: string;
  currency: Currency | "";
  contactNote: string;
  certificates: TrainerCertificate[];
  availability: AvailabilitySlot[];
}
