import { apiClient } from "@/lib/api-client";

import type { CreateTrainingRequestRequest } from "./training-request.dto";

export const createTrainingRequest = (
  coachProfileId: string,
  data: CreateTrainingRequestRequest
) =>
  apiClient(`/api/training-requests/coach-profiles/${coachProfileId}`, {
    method: "POST",
    body: data,
  });
