import { useProfileQuery } from "@/features/profile/hooks/useProfileQuery";
import { useCoachTrainingRequestsApi } from "@/features/training-requests/shared/api/coach-training-requests.api";
import { useTrainingRequestApi } from "@/features/training-requests/shared/api/training-request.api";
import {
  mapClosedTrainingRequestDtoToModel,
  mapTrainingRequestDtoToModel,
} from "@/features/training-requests/shared/lib/training-request.mapper";
import { isCoachRole } from "@/shared/utils/profileRole";
import { useCallback, useEffect, useMemo, useState } from "react";
import { dedupeRequests } from "../lib/coach-training-requests.utils";
import type {
  CoachRequestFilter,
  CoachRequestViewMode,
  CoachTrainingRequest,
} from "../model/coach-training-request.model";

export const useCoachTrainingRequestsData = () => {
  const { getMyTrainingRequests } = useTrainingRequestApi();
  const { getCoachTrainingRequests, getClosedCoachTrainingRequests } =
    useCoachTrainingRequestsApi();
  const { profile, loading: profileLoading } = useProfileQuery();
  const isCoach = isCoachRole(profile?.role);

  const [coachViewMode, setCoachViewMode] = useState<CoachRequestViewMode>("coach");
  const [coachRequestFilter, setCoachRequestFilter] =
    useState<CoachRequestFilter>("pending");
  const [pendingRequests, setPendingRequests] = useState<CoachTrainingRequest[]>([]);
  const [approvedRequests, setApprovedRequests] = useState<CoachTrainingRequest[]>([]);
  const [closedRequests, setClosedRequests] = useState<CoachTrainingRequest[]>([]);
  const [rejectedRequests, setRejectedRequests] = useState<CoachTrainingRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<CoachTrainingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCoachViewMode(isCoach ? "coach" : "user");
  }, [isCoach]);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        outgoingResponse,
        pendingResponse,
        approvedResponse,
        closedResponse,
        rejectedResponse,
      ] = await Promise.all([
        getMyTrainingRequests(),
        isCoach ? getCoachTrainingRequests("PENDING") : Promise.resolve([]),
        isCoach ? getCoachTrainingRequests("APPROVED") : Promise.resolve([]),
        isCoach ? getClosedCoachTrainingRequests() : Promise.resolve([]),
        isCoach ? getCoachTrainingRequests("REJECTED") : Promise.resolve([]),
      ]);

      setOutgoingRequests(outgoingResponse.map(mapTrainingRequestDtoToModel));
      setPendingRequests(dedupeRequests(pendingResponse.map(mapTrainingRequestDtoToModel)));
      setApprovedRequests(dedupeRequests(approvedResponse.map(mapTrainingRequestDtoToModel)));
      setClosedRequests(dedupeRequests(closedResponse.map(mapClosedTrainingRequestDtoToModel)));
      setRejectedRequests(dedupeRequests(rejectedResponse.map(mapTrainingRequestDtoToModel)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests.");
      setOutgoingRequests([]);
      setPendingRequests([]);
      setApprovedRequests([]);
      setClosedRequests([]);
      setRejectedRequests([]);
    } finally {
      setLoading(false);
    }
  }, [
    getClosedCoachTrainingRequests,
    getCoachTrainingRequests,
    getMyTrainingRequests,
    isCoach,
  ]);

  useEffect(() => {
    if (profileLoading) {
      return;
    }

    void loadRequests();
  }, [loadRequests, profileLoading]);

  const visibleRequests = useMemo(() => {
    if (!isCoach || coachViewMode === "user") {
      return outgoingRequests;
    }

    switch (coachRequestFilter) {
      case "approved":
        return approvedRequests;
      case "rejected":
        return rejectedRequests;
      case "closed":
        return closedRequests;
      default:
        return pendingRequests;
    }
  }, [
    approvedRequests,
    closedRequests,
    coachRequestFilter,
    coachViewMode,
    isCoach,
    outgoingRequests,
    pendingRequests,
    rejectedRequests,
  ]);

  return {
    approvedRequests,
    closedRequests,
    coachRequestFilter,
    coachViewMode,
    error,
    isCoach,
    loadRequests,
    loading,
    outgoingRequests,
    pendingRequests,
    profileLoading,
    rejectedRequests,
    setApprovedRequests,
    setClosedRequests,
    setCoachRequestFilter,
    setCoachViewMode,
    setError,
    setOutgoingRequests,
    setPendingRequests,
    setRejectedRequests,
    visibleRequests,
  };
};
