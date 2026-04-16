import { useCallback, useEffect, useMemo, useState } from "react";

import { useProfileApi } from "@/features/profile/api/profile.api";
import { isCoachRole } from "@/shared/utils/profileRole";

import { useCoachTrainingRequestsApi } from "../../shared/api/coach-training-requests.api";
import { useTrainingRequestApi } from "../../shared/api/training-request.api";
import type {
  ClosedTrainingRequestResponseDto,
  TrainingRequestResponseDto,
} from "../../shared/api/training-request.dto";
import {
  mapClosedTrainingRequestDtoToModel,
  mapTrainingRequestDtoToModel,
  mapTrainingRequestStatusToUpdateDto,
} from "../../shared/lib/training-request.mapper";
import type {
  CoachRequestFilter,
  CoachRequestViewMode,
  CoachTrainingRequest,
  TrainingPlanDraft,
  TrainingRequestStatus,
} from "../model/coach-training-request.model";
import {
  createTrainingPlanDraft,
  dedupeRequests,
  getDecisionDescription,
  getTrainingPlanDescription,
  getTrainingPlanFileName,
  getTrainingPlanName,
} from "../lib/coach-training-requests.utils";

interface TrainingRequestsData {
  approvedRequests: CoachTrainingRequest[];
  closedRequests: CoachTrainingRequest[];
  outgoingRequests: CoachTrainingRequest[];
  pendingRequests: CoachTrainingRequest[];
  rejectedRequests: CoachTrainingRequest[];
}

const emptyData = (): TrainingRequestsData => ({
  approvedRequests: [],
  closedRequests: [],
  outgoingRequests: [],
  pendingRequests: [],
  rejectedRequests: [],
});

const buildRequestData = async (
  isCoach: boolean,
  getMyTrainingRequests: () => Promise<TrainingRequestResponseDto[]>,
  getCoachTrainingRequests: (
    status?: "PENDING" | "APPROVED" | "REJECTED"
  ) => Promise<TrainingRequestResponseDto[]>,
  getClosedCoachTrainingRequests: () => Promise<ClosedTrainingRequestResponseDto[]>
): Promise<TrainingRequestsData> => {
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
    approvedRequests: dedupeRequests(approvedResponse.map(mapTrainingRequestDtoToModel)),
    closedRequests: dedupeRequests(closedResponse.map(mapClosedTrainingRequestDtoToModel)),
    outgoingRequests: outgoingResponse.map(mapTrainingRequestDtoToModel),
    pendingRequests: dedupeRequests(pendingResponse.map(mapTrainingRequestDtoToModel)),
    rejectedRequests: dedupeRequests(rejectedResponse.map(mapTrainingRequestDtoToModel)),
  };
};

const mergeDecisionDescriptions = (
  requests: CoachTrainingRequest[],
  previous: Record<string, string>
) => {
  const next = { ...previous };

  requests.forEach((request) => {
    if (!(request.id in next)) {
      next[request.id] = getDecisionDescription(request);
    }
  });

  return next;
};

const mergeTrainingPlanDrafts = (
  requests: CoachTrainingRequest[],
  previous: Record<string, TrainingPlanDraft>
) => {
  const next = { ...previous };

  requests
    .filter((request) => request.status === "APPROVED")
    .forEach((request) => {
      if (!next[request.id]) {
        const draft = createTrainingPlanDraft(request);
        next[request.id] = {
          ...draft,
          existingFileName: draft.existingFileName || getTrainingPlanFileName(request),
          planDescription: draft.planDescription || getTrainingPlanDescription(request),
          planName: draft.planName || getTrainingPlanName(request),
        };
      }
    });

  return next;
};

const getVisibleRequests = (
  isCoach: boolean,
  coachViewMode: CoachRequestViewMode,
  coachRequestFilter: CoachRequestFilter,
  data: TrainingRequestsData
) => {
  if (!isCoach || coachViewMode === "user") {
    return data.outgoingRequests;
  }

  switch (coachRequestFilter) {
    case "approved":
      return data.approvedRequests;
    case "rejected":
      return data.rejectedRequests;
    case "closed":
      return data.closedRequests;
    default:
      return data.pendingRequests;
  }
};

export const useCoachTrainingRequests = () => {
  const { getProfile } = useProfileApi();
  const { downloadTrainingPlanFile, getMyTrainingRequests } = useTrainingRequestApi();
  const {
    getClosedCoachTrainingRequests,
    getCoachTrainingRequests,
    updateCoachTrainingRequestStatus,
    uploadCoachTrainingPlan,
  } = useCoachTrainingRequestsApi();
  const [profile, setProfile] = useState<import("@/features/profile/model/profile.types").ProfileResponseDto | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const isCoach = isCoachRole(profile?.role);

  const [coachViewMode, setCoachViewMode] = useState<CoachRequestViewMode>("coach");
  const [coachRequestFilter, setCoachRequestFilter] = useState<CoachRequestFilter>("pending");
  const [requests, setRequests] = useState<TrainingRequestsData>(emptyData);
  const [decisionDescriptions, setDecisionDescriptions] = useState<Record<string, string>>({});
  const [trainingPlanDrafts, setTrainingPlanDrafts] = useState<Record<string, TrainingPlanDraft>>(
    {}
  );
  const [expandedApprovedRequestId, setExpandedApprovedRequestId] = useState<string | null>(null);
  const [downloadingRequestId, setDownloadingRequestId] = useState<string | null>(null);
  const [savingApprovedRequestId, setSavingApprovedRequestId] = useState<string | null>(null);
  const [updatingRequestId, setUpdatingRequestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [getProfile]);

  const loadRequests = useCallback(
    async (
      previousDecisionDescriptions: Record<string, string> = decisionDescriptions,
      previousTrainingPlanDrafts: Record<string, TrainingPlanDraft> = trainingPlanDrafts
    ) => {
      setLoading(true);
      setError(null);

      try {
        const nextRequests = await buildRequestData(
          isCoach,
          getMyTrainingRequests,
          getCoachTrainingRequests,
          getClosedCoachTrainingRequests
        );
        const allRequests = [
          ...nextRequests.outgoingRequests,
          ...nextRequests.pendingRequests,
          ...nextRequests.approvedRequests,
          ...nextRequests.closedRequests,
          ...nextRequests.rejectedRequests,
        ];

        setRequests(nextRequests);
        setDecisionDescriptions(mergeDecisionDescriptions(allRequests, previousDecisionDescriptions));
        setTrainingPlanDrafts(mergeTrainingPlanDrafts(allRequests, previousTrainingPlanDrafts));
      } catch (loadError) {
        setRequests(emptyData());
        setError(loadError instanceof Error ? loadError.message : "Failed to load requests.");
      } finally {
        setLoading(false);
      }
    },
    [getClosedCoachTrainingRequests, getCoachTrainingRequests, getMyTrainingRequests, isCoach]
  );

  useEffect(() => {
    if (!profileLoading) {
      void loadRequests();
    }
  }, [loadRequests, profileLoading]);

  const updateRequestStatus = useCallback(
    async (trainingRequestId: string, status: TrainingRequestStatus, coachResponse: string) => {
      if (status === "PENDING" || status === "CLOSED") {
        setError("Only APPROVED or REJECTED status updates are allowed.");
        return;
      }

      const trimmedCoachResponse = coachResponse.trim();
      if (!trimmedCoachResponse) {
        setError("A status comment is required when approving or rejecting a request.");
        return;
      }

      setUpdatingRequestId(trainingRequestId);
      setError(null);

      try {
        await updateCoachTrainingRequestStatus(
          trainingRequestId,
          mapTrainingRequestStatusToUpdateDto(status, trimmedCoachResponse)
        );

        const nextDecisionDescriptions = {
          ...decisionDescriptions,
          [trainingRequestId]: trimmedCoachResponse,
        };

        setDecisionDescriptions(nextDecisionDescriptions);

        if (status === "APPROVED") {
          setExpandedApprovedRequestId(trainingRequestId);
        }

        await loadRequests(nextDecisionDescriptions, trainingPlanDrafts);
      } catch (updateError) {
        setError(updateError instanceof Error ? updateError.message : "Failed to update status.");
      } finally {
        setUpdatingRequestId(null);
      }
    },
    [
      decisionDescriptions,
      loadRequests,
      trainingPlanDrafts,
      updateCoachTrainingRequestStatus,
    ]
  );

  const saveTrainingPlan = useCallback(
    async (request: CoachTrainingRequest) => {
      const draft = trainingPlanDrafts[request.id] ?? createTrainingPlanDraft(request);
      const trimmedPlanName = draft.planName.trim();
      const trimmedPlanDescription = draft.planDescription.trim();

      if (request.status !== "APPROVED") {
        setError("Training plan can only be uploaded for approved requests.");
        return;
      }

      if (!draft.file) {
        setError("Select a PDF or DOCX file to upload the training plan.");
        return;
      }

      setSavingApprovedRequestId(request.id);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", draft.file);
        if (trimmedPlanName) {
          formData.append("planName", trimmedPlanName);
        }
        if (trimmedPlanDescription) {
          formData.append("planDescription", trimmedPlanDescription);
        }

        await uploadCoachTrainingPlan(request.id, formData);

        const nextDrafts = {
          ...trainingPlanDrafts,
          [request.id]: {
            existingFileName: draft.file.name,
            file: null,
            planDescription: trimmedPlanDescription,
            planName: trimmedPlanName || draft.file.name.replace(/\.[^.]+$/, ""),
          },
        };

        setTrainingPlanDrafts(nextDrafts);
        await loadRequests(decisionDescriptions, nextDrafts);
      } catch (saveError) {
        setError(
          saveError instanceof Error ? saveError.message : "Failed to upload the training plan."
        );
      } finally {
        setSavingApprovedRequestId(null);
      }
    },
    [decisionDescriptions, loadRequests, trainingPlanDrafts, uploadCoachTrainingPlan]
  );

  const downloadTrainingPlan = useCallback(
    async (request: CoachTrainingRequest) => {
      setDownloadingRequestId(request.id);
      setError(null);

      try {
        const { blob, fileName } = await downloadTrainingPlanFile(request.id);
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(downloadUrl);
      } catch (downloadError) {
        setError(
          downloadError instanceof Error ? downloadError.message : "Failed to download the training plan."
        );
      } finally {
        setDownloadingRequestId(null);
      }
    },
    [downloadTrainingPlanFile]
  );

  const setDecisionDescription = useCallback((requestId: string, value: string) => {
    setDecisionDescriptions((current) => ({
      ...current,
      [requestId]: value,
    }));
  }, []);

  const updateTrainingPlanDraft = useCallback((requestId: string, draft: TrainingPlanDraft) => {
    setTrainingPlanDrafts((current) => ({
      ...current,
      [requestId]: draft,
    }));
  }, []);

  const toggleApprovedRequestEditor = useCallback((requestId: string) => {
    setExpandedApprovedRequestId((current) => (current === requestId ? null : requestId));
  }, []);

  const visibleRequests = useMemo(
    () => getVisibleRequests(isCoach, coachViewMode, coachRequestFilter, requests),
    [coachRequestFilter, coachViewMode, isCoach, requests]
  );

  return {
    coachRequestFilter,
    coachViewMode,
    decisionDescriptions,
    downloadingRequestId,
    downloadTrainingPlan,
    error,
    expandedApprovedRequestId,
    isCoach,
    loading,
    profileLoading,
    saveTrainingPlan,
    savingApprovedRequestId,
    setCoachRequestFilter,
    setCoachViewMode,
    setDecisionDescription,
    toggleApprovedRequestEditor,
    trainingPlanDrafts,
    updateRequestStatus,
    updateTrainingPlanDraft,
    updatingRequestId,
    visibleRequests,
  };
};

export type UseCoachTrainingRequestsResult = ReturnType<typeof useCoachTrainingRequests>;
