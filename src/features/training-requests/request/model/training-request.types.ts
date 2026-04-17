import type { ActivityLevel, Goal } from "@/shared/types/profile.types";

export interface TrainingRequestFormData {
  weeklyWorkouts: string;
  preferredSessionLength: string;
  trainingLocation: string;
  currentWeightKg: string;
  targetWeightKg: string;
  goal: Goal | "";
  activityLevel: ActivityLevel | "";
  customerDescription: string;
}

export interface CoachCertificateData {
  id: string;
  certificateName: string;
  issuer: string;
  issuedAt: string;
  fileName: string;
  fileUrl: string;
}

export interface CoachSpecialtyData {
  label: string;
  value: string;
}

export interface CoachCardData {
  id: string;
  fullName: string;
  email: string;
  bio: string;
  contactNote?: string;
  specialties: CoachSpecialtyData[];
  weeklyAvailability: string;
  availabilitySlots: string[];
  experienceLabel: string;
  certificates?: CoachCertificateData[];
}

export interface CoachProfileListResponse {
  id?: string;
  userId?: string;
  coachName?: string | null;
  shortDescription?: string | null;
  trainingStartedAt?: string | null;
  trainingFormat?: string | null;
  maxCapacity?: number | null;
  currency?: string | null;
  priceFrom?: number | null;
  priceTo?: number | null;
  contactNote?: string | null;
  email?: string | null;
  certificates?: Array<{
    id?: string | null;
    certificateName?: string | null;
    issuer?: string | null;
    issuedAt?: string | null;
    fileName?: string | null;
    fileUrl?: string | null;
  }>;
  availabilities?: Array<{
    dayOfWeek?: string;
    available?: boolean;
    startTime?: string | null;
    endTime?: string | null;
  }>;
}
