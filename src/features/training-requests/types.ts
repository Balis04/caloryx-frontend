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

export interface CreateTrainingRequestRequest {
  weeklyTrainingCount: number;
  sessionDurationMinutes: number;
  preferredLocation: string;
  requestDescription: string;
}

export type TrainingRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CLOSED";

export interface TrainingRequestResponse {
  id: string;
  coachProfileId: string;
  requesterUserId: string;
  coachName: string;
  requesterName: string;
  requesterEmail: string;
  weeklyTrainingCount: number;
  sessionDurationMinutes: number;
  preferredLocation: string;
  status: TrainingRequestStatus;
  requestDescription: string | null;
  coachResponse: string | null;
  createdAt: string;
}

export interface ClosedTrainingRequestResponse {
  requestId: string;
  coachName: string;
  requesterName: string;
  requesterEmail: string;
  weeklyTrainingCount: number;
  sessionDurationMinutes: number;
  preferredLocation: string;
  status: TrainingRequestStatus;
  requestDescription: string | null;
  coachResponse: string | null;
  createdAt: string;
  planName?: string | null;
  planDescription?: string | null;
  fileName?: string | null;
  uploadedAt?: string | null;
}

export interface UpdateTrainingRequestStatusRequest {
  status: Exclude<TrainingRequestStatus, "PENDING" | "CLOSED">;
  coachResponse: string;
}

export interface CoachTrainingRequest {
  id: string;
  coachProfileId?: string;
  requesterUserId?: string;
  coachName: string;
  requesterName: string;
  requesterEmail: string;
  weeklyTrainingCount: number;
  sessionDurationMinutes: number;
  preferredLocation: string;
  status: TrainingRequestStatus;
  requestDescription: string;
  coachResponse: string;
  createdAt: string;
  planName?: string | null;
  planDescription?: string | null;
  fileName?: string | null;
  uploadedAt?: string | null;
}

export type CoachRequestViewMode = "coach" | "user";

export type CoachRequestFilter = "pending" | "approved" | "rejected" | "closed";

export interface TrainingPlanDraft {
  planName: string;
  planDescription: string;
  file: File | null;
  existingFileName: string;
}
