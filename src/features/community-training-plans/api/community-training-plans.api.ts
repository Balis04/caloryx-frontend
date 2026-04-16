import { apiClient, buildApiUrl } from "@/lib/api-client";

import type { CommunityTrainingPlan } from "../types/community-training-plan.types";

const getCommunityTrainingPlans = () =>
  apiClient<CommunityTrainingPlan[]>("/api/community-training-plans");

export const useCommunityTrainingPlansApi = () => {
  return { getCommunityTrainingPlans };
};

export const getCommunityTrainingPlanDownloadUrl = (downloadUrl: string) =>
  buildApiUrl(downloadUrl);
