export type TrainingRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CLOSED";

export type TrainerViewMode = "trainer" | "user";

export type TrainerRequestFilter = "pending" | "approved" | "rejected" | "closed";

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
  coachNote: string;
  description: string | null;
  createdAt: string;
  trainingPlanName: string | null;
  trainingPlanDescription: string | null;
  trainingPlanFileName: string | null;
  trainingPlanFileUrl: string | null;
  trainingPlanContentType: string | null;
  trainingPlanFileSizeBytes: number | null;
  trainingPlanUploadedAt: string | null;
}

export interface ApprovedRequestDraft {
  planName: string;
  description: string;
  file: File | null;
  existingFileName: string;
  existingFileUrl: string;
}
