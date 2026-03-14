export type TrainingFormat = "ONLINE" | "HYBRID" | "IN_PERSON";
export type Currency = "HUF" | "EUR" | "USD";

export interface AvailabilitySlot {
  dayOfWeek: string;
  label: string;
  enabled: boolean;
  from: string;
  until: string;
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
  certificates: string[];
  availability: AvailabilitySlot[];
}
