import { apiClient } from "@/lib/api-client";

import type { CoachProfileListResponseDto } from "../model/training-request.types";

const COACH_DIRECTORY_PATH = "/api/coach-profiles";

export const getCoachDirectory = () =>
  apiClient<CoachProfileListResponseDto[]>(COACH_DIRECTORY_PATH);
