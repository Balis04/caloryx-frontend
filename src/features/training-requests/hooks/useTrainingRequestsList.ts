import { useCallback, useEffect, useState } from "react";

import {
  getClosedCoachTrainingRequests,
  getCoachTrainingRequests,
  getMyTrainingRequests,
} from "../api/training-requests.api";
import {
  mapClosedTrainingRequestResponseToModel,
  mapTrainingRequestResponseToModel,
} from "../lib/training-requests.mapper";
import type { CoachTrainingRequest } from "../types";

export interface TrainingRequestsListData {
  approvedRequests: CoachTrainingRequest[];
  closedRequests: CoachTrainingRequest[];
  outgoingRequests: CoachTrainingRequest[];
  pendingRequests: CoachTrainingRequest[];
  rejectedRequests: CoachTrainingRequest[];
}

const emptyData = (): TrainingRequestsListData => ({
  approvedRequests: [],
  closedRequests: [],
  outgoingRequests: [],
  pendingRequests: [],
  rejectedRequests: [],
});

const buildRequestData = async (
  isCoach: boolean
): Promise<TrainingRequestsListData> => {
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

  return {
    approvedRequests: approvedResponse.map(mapTrainingRequestResponseToModel),
    closedRequests: closedResponse.map(mapClosedTrainingRequestResponseToModel),
    outgoingRequests: outgoingResponse.map(mapTrainingRequestResponseToModel),
    pendingRequests: pendingResponse.map(mapTrainingRequestResponseToModel),
    rejectedRequests: rejectedResponse.map(mapTrainingRequestResponseToModel),
  };
};

export const useTrainingRequestsList = ({
  enabled,
  isCoach,
}: {
  enabled: boolean;
  isCoach: boolean;
}) => {
  const [requests, setRequests] = useState<TrainingRequestsListData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setRequests(await buildRequestData(isCoach));
    } catch (loadError) {
      setRequests(emptyData());
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load requests."
      );
    } finally {
      setLoading(false);
    }
  }, [isCoach]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    void reload();
  }, [enabled, reload]);

  return {
    error,
    loading,
    reload,
    requests,
  };
};
