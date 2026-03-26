export type TrainingRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CLOSED";

export interface TrainingRequestResponseDto {
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
  description: string | null;
  coachNote: string | null;
  createdAt: string;
  planName?: string | null;
  planDescription?: string | null;
  fileName?: string | null;
  fileUrl?: string | null;
  uploadedAt?: string | null;
  trainingPlanUploadedAt?: string | null;
  trainingPlanContentType?: string | null;
  trainingPlanFileSizeBytes?: number | null;
}

export interface CreateTrainingRequestDto {
  weeklyTrainingCount: number;
  sessionDurationMinutes: number;
  preferredLocation: string;
  description: string;
}
