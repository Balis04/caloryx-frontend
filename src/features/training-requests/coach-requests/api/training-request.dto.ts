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
