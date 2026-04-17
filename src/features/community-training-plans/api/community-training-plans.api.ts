import { apiClient, buildApiUrl } from "@/lib/api-client";

import type { CommunityTrainingPlan } from "../types";

export const getCommunityTrainingPlans = () =>
  apiClient<CommunityTrainingPlan[]>("/api/community-training-plans");

export const getCommunityTrainingPlanDownloadUrl = (downloadUrl: string) =>
  buildApiUrl(downloadUrl);

