import { useCallback } from "react";

import { useApi } from "@/hooks/useApi";

import type { CoachProfileListResponseDto } from "../types/coach-directory.dto";

const COACH_DIRECTORY_PATH = "/api/coach-profiles";

export const useCoachDirectoryApi = () => {
  const { request } = useApi();

  const getCoachDirectory = useCallback(
    () => request<CoachProfileListResponseDto[]>(COACH_DIRECTORY_PATH),
    [request]
  );

  return {
    getCoachDirectory,
  };
};
