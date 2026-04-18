import { useEffect, useMemo, useState } from "react";
import { getProfile } from "@/features/profile/api/profile.api";
import type { ProfileResponse } from "@/features/profile/types";
import { isCoachRole } from "@/shared/utils/profileRole";

import type {
  CoachRequestFilter,
  CoachRequestViewMode,
  CoachTrainingRequest,
  TrainingRequestStatus,
} from "../types";
import {
  getTrainingRequestsEmptyMessage,
  getVisibleTrainingRequests,
} from "../lib/training-requests.page";
import { useApprovedTrainingPlanForm } from "./useApprovedTrainingPlanForm";
import { useCoachRequestStatusForm } from "./useCoachRequestStatusForm";
import {
  useTrainingRequestsList,
} from "./useTrainingRequestsList";

export const useCoachTrainingRequestsPage = () => {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const isCoach = isCoachRole(profile?.role);

  const [coachViewMode, setCoachViewMode] =
    useState<CoachRequestViewMode>("coach");
  const [coachRequestFilter, setCoachRequestFilter] =
    useState<CoachRequestFilter>("pending");
  const coachRequestStatusForm = useCoachRequestStatusForm();
  const approvedTrainingPlanForm = useApprovedTrainingPlanForm();
  const {
    decisionDescriptions,
    setDecisionDescription,
    submitRequestStatus,
    updatingRequestId,
    error: requestStatusError,
  } = coachRequestStatusForm;
  const {
    downloadingRequestId,
    downloadTrainingPlan,
    error: trainingPlanError,
    expandedApprovedRequestId,
    getTrainingPlanDraft,
    openTrainingPlanEditor,
    saveTrainingPlan,
    savingApprovedRequestId,
    toggleApprovedRequestEditor,
    updateTrainingPlanDraft,
  } = approvedTrainingPlanForm;
  const trainingRequestsList = useTrainingRequestsList({
    enabled: !profileLoading,
    isCoach,
  });

  useEffect(() => {
    setCoachViewMode(isCoach ? "coach" : "user");
  }, [isCoach]);

  useEffect(() => {
    const loadProfile = async () => {
      setProfileLoading(true);

      try {
        const response = await getProfile();
        setProfile(response);
      } catch {
        setProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };

    void loadProfile();
  }, []);

  const visibleRequests = useMemo(
    () =>
      getVisibleTrainingRequests(
        isCoach,
        coachViewMode,
        coachRequestFilter,
        trainingRequestsList.requests
      ),
    [coachRequestFilter, coachViewMode, isCoach, trainingRequestsList.requests]
  );
  const showCoachIncomingRequests = isCoach && coachViewMode === "coach";
  const emptyMessage = getTrainingRequestsEmptyMessage(
    showCoachIncomingRequests,
    coachRequestFilter
  );

  return {
    coachRequestFilter,
    coachViewMode,
    decisionDescriptions,
    downloadingRequestId,
    downloadTrainingPlan,
    emptyMessage,
    error: trainingRequestsList.error ?? requestStatusError ?? trainingPlanError,
    expandedApprovedRequestId,
    getTrainingPlanDraft,
    isCoach,
    loading: trainingRequestsList.loading,
    profileLoading,
    saveTrainingPlan: (request: CoachTrainingRequest) =>
      saveTrainingPlan(request, trainingRequestsList.reload),
    savingApprovedRequestId,
    setCoachRequestFilter,
    setCoachViewMode,
    setDecisionDescription,
    showCoachIncomingRequests,
    toggleApprovedRequestEditor,
    updateRequestStatus: async (
      trainingRequestId: string,
      status: TrainingRequestStatus,
      coachResponse: string
    ) => {
      const isUpdated = await submitRequestStatus(
        trainingRequestId,
        status,
        coachResponse,
        trainingRequestsList.reload
      );

      if (isUpdated && status === "APPROVED") {
        openTrainingPlanEditor(trainingRequestId);
      }
    },
    updateTrainingPlanDraft,
    updatingRequestId,
    visibleRequests,
  };
};
