import { useCallback, useEffect, useState } from "react";

import type {
  ClosedTrainingRequestResponseDto,
  TrainingRequestResponseDto,
} from "../../shared/api/training-request.dto";
import {
  mapClosedTrainingRequestDtoToModel,
  mapTrainingRequestDtoToModel,
} from "../../shared/lib/training-request.mapper";
import { dedupeRequests } from "../lib/coach-training-requests.utils";
import type { CoachTrainingRequest } from "../model/coach-training-request.model";

interface Params {
  getMyTrainingRequests: () => Promise<TrainingRequestResponseDto[]>;
  getCoachTrainingRequests: (
    status?: "PENDING" | "APPROVED" | "REJECTED"
  ) => Promise<TrainingRequestResponseDto[]>;
  getClosedCoachTrainingRequests: () => Promise<ClosedTrainingRequestResponseDto[]>;
  isCoach: boolean;
  profileLoading: boolean;
  hydratePresentationState: (requests: CoachTrainingRequest[]) => void;
}

export const useCoachTrainingRequestsData = ({
  getMyTrainingRequests,
  getCoachTrainingRequests,
  getClosedCoachTrainingRequests,
  isCoach,
  profileLoading,
  hydratePresentationState,
}: Params) => {
  const [pendingRequests, setPendingRequests] = useState<CoachTrainingRequest[]>([]);
  const [approvedRequests, setApprovedRequests] = useState<CoachTrainingRequest[]>([]);
  const [closedRequests, setClosedRequests] = useState<CoachTrainingRequest[]>([]);
  const [rejectedRequests, setRejectedRequests] = useState<CoachTrainingRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<CoachTrainingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      const nextOutgoingRequests = outgoingResponse.map(mapTrainingRequestDtoToModel);
      const nextPendingRequests = dedupeRequests(pendingResponse.map(mapTrainingRequestDtoToModel));
      const nextApprovedRequests = dedupeRequests(
        approvedResponse.map(mapTrainingRequestDtoToModel)
      );
      const nextClosedRequests = dedupeRequests(
        closedResponse.map(mapClosedTrainingRequestDtoToModel)
      );
      const nextRejectedRequests = dedupeRequests(
        rejectedResponse.map(mapTrainingRequestDtoToModel)
      );

      setOutgoingRequests(nextOutgoingRequests);
      setPendingRequests(nextPendingRequests);
      setApprovedRequests(nextApprovedRequests);
      setClosedRequests(nextClosedRequests);
      setRejectedRequests(nextRejectedRequests);
      hydratePresentationState([
        ...nextOutgoingRequests,
        ...nextPendingRequests,
        ...nextApprovedRequests,
        ...nextClosedRequests,
        ...nextRejectedRequests,
      ]);
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
    hydratePresentationState,
    isCoach,
  ]);

  useEffect(() => {
    if (profileLoading) {
      return;
    }

    void loadRequests();
  }, [loadRequests, profileLoading]);

  return {
    approvedRequests,
    closedRequests,
    error,
    loadRequests,
    loading,
    outgoingRequests,
    pendingRequests,
    rejectedRequests,
    setApprovedRequests,
    setClosedRequests,
    setError,
    setOutgoingRequests,
    setPendingRequests,
    setRejectedRequests,
  };
};
