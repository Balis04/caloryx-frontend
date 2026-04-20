import { useEffect, useMemo, useState } from "react";

import { getCommunityTrainingPlans } from "../api/community-training-plans.api";
import {
  COMMUNITY_PLAN_SORT_ORDER,
  detectCommunityPlanVariant,
} from "../lib/community-training-plans.formatters";
import type { CommunityTrainingPlan } from "../types";

export const useCommunityTrainingPlans = () => {
  const [plans, setPlans] = useState<CommunityTrainingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await getCommunityTrainingPlans();

        setPlans(data);
      } catch {
        setPlans([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadPlans();
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
    isLoading,
    sortedPlans,
  };
};

