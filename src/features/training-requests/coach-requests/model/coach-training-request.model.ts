import type {
  TrainingRequest,
  TrainingRequestStatus,
} from "@/features/training-requests/shared/model/training-request.model";

export type { TrainingRequestStatus };

export type CoachTrainingRequest = TrainingRequest;

export type CoachRequestViewMode = "coach" | "user";

export type CoachRequestFilter = "pending" | "approved" | "rejected" | "closed";

export interface TrainingPlanDraft {
  planName: string;
  planDescription: string;
  file: File | null;
  existingFileName: string;
}
