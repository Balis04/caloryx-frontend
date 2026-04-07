import { useApi } from "@/hooks/useApi";
import { buildApiUrl } from "@/lib/api-client";
import { useCallback } from "react";

import type { CommunityTrainingPlan } from "../types/community-training-plan.types";

export const useCommunityTrainingPlansApi = () => {
  const { request } = useApi();

  const getCommunityTrainingPlans = useCallback(
    () => request<CommunityTrainingPlan[]>("/api/community-training-plans"),
    [request]
  );

  return { getCommunityTrainingPlans };
};

export const getCommunityTrainingPlanDownloadUrl = (downloadUrl: string) =>
  buildApiUrl(downloadUrl);
