import { apiClient } from "@/lib/api-client";

import type { CreateTrainingRequestDto } from "./training-request.dto";

export const createTrainingRequest = (
  coachProfileId: string,
  data: CreateTrainingRequestDto
) =>
  apiClient(`/api/training-requests/coach-profiles/${coachProfileId}`, {
    method: "POST",
    body: data,
  });
