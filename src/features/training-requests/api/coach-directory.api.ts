import { apiClient } from "@/lib/api-client";

import type { CoachProfileListResponse } from "@/features/training-requests/types";

const COACH_DIRECTORY_PATH = "/api/coach-profiles";

export const getCoachDirectory = () =>
  apiClient<CoachProfileListResponse[]>(COACH_DIRECTORY_PATH);

