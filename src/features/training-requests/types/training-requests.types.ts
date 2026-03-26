import type {
  TrainingRequest,
  TrainingRequestStatus,
} from "@/features/training-request/model/training-request.model";

export type { TrainingRequestStatus };

export type TrainerViewMode = "trainer" | "user";

export type TrainerRequestFilter = "pending" | "approved" | "rejected" | "closed";

export type TrainingRequestResponse = TrainingRequest;

export interface ApprovedRequestDraft {
  planName: string;
  planDescription: string;
  file: File | null;
  existingFileName: string;
}
