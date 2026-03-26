import type { TrainingRequestStatus } from "../api/training-request.dto";

export type { TrainingRequestStatus };

export interface TrainingRequest {
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
  description: string;
  coachNote: string;
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
