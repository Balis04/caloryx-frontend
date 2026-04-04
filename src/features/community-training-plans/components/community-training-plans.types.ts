import type { UseCommunityTrainingPlansResult } from "../hooks/useCommunityTrainingPlans";
import type { CommunityTrainingPlan } from "../types/community-training-plan.types";

export interface CommunityPlansHeroAsideProps {
  planCount: number;
}

export interface CommunityPlansGridProps {
  error: string | null;
  isLoading: boolean;
  plans: CommunityTrainingPlan[];
}

export interface CommunityTrainingPlansWorkspaceProps {
  communityTrainingPlans: UseCommunityTrainingPlansResult;
}
