import { apiClient } from "@/lib/api-client";

import type { CoachProfileListResponseDto } from "../types/coach-directory.dto";

const COACH_DIRECTORY_PATH = "/api/coach-profiles";

const getCoachDirectory = () =>
  apiClient<CoachProfileListResponseDto[]>(COACH_DIRECTORY_PATH);

export const useCoachDirectoryApi = () => {
  return {
    getCoachDirectory,
  };
};
