import type { TrainingRequestStatus } from "../api/training-request.dto";

export type { TrainingRequestStatus };

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
