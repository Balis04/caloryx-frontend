import type { TrainingRequestStatus } from "../api/training-request.dto";

export type { TrainingRequestStatus };

export interface TrainingRequest {
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
