import { useEffect, useMemo, useState } from "react";

import { getCommunityTrainingPlans } from "../api/community-training-plans.api";
import {
  COMMUNITY_PLAN_SORT_ORDER,
  detectCommunityPlanVariant,
} from "../lib/community-training-plans.presentation";
import type { CommunityTrainingPlan } from "../types/community-training-plan.types";

export const useCommunityTrainingPlans = () => {
  const [plans, setPlans] = useState<CommunityTrainingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPlans = async () => {
      try {
        const data = await getCommunityTrainingPlans();

        if (!isMounted) {
          return;
        }

        setPlans(data);
        setError(null);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(err instanceof Error ? err.message : "Failed to load community plans.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadPlans();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedPlans = useMemo(
    () =>
      [...plans].sort((a, b) => {
        return (
          COMMUNITY_PLAN_SORT_ORDER.indexOf(detectCommunityPlanVariant(a.fileName).key) -
          COMMUNITY_PLAN_SORT_ORDER.indexOf(detectCommunityPlanVariant(b.fileName).key)
        );
      }),
    [plans]
  );

  return {
    error,
    isLoading,
    plans,
    sortedPlans,
  };
};

export type UseCommunityTrainingPlansResult = ReturnType<typeof useCommunityTrainingPlans>;
