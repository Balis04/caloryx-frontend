import { useProfileQuery } from "@/features/profile/hooks/useProfileQuery";
import { isCoachRole } from "@/shared/utils/profileRole";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCoachTrainingRequestsApi } from "../../shared/api/coach-training-requests.api";
import { useTrainingRequestApi } from "../../shared/api/training-request.api";
import {
  mapClosedTrainingRequestDtoToModel,
  mapTrainingRequestDtoToModel,
  mapTrainingRequestStatusToUpdateDto,
} from "../../shared/lib/training-request.mapper";
import {
  createTrainingPlanDraft,
  dedupeRequests,
  getDecisionDescription,
  getTrainingPlanDescription,
  getTrainingPlanFileName,
  getTrainingPlanName,
  upsertRequest,
} from "../lib/coach-training-requests.utils";
import type {
  CoachRequestFilter,
  CoachRequestViewMode,
  CoachTrainingRequest,
  TrainingPlanDraft,
  TrainingRequestStatus,
} from "../model/coach-training-request.model";

export const useCoachTrainingRequests = () => {
  const { getMyTrainingRequests, downloadTrainingPlanFile } = useTrainingRequestApi();
  const {
    getCoachTrainingRequests,
    getClosedCoachTrainingRequests,
    updateCoachTrainingRequestStatus,
    uploadCoachTrainingPlan,
  } = useCoachTrainingRequestsApi();
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
  const [decisionDescriptions, setDecisionDescriptions] = useState<Record<string, string>>(
    {}
  );
  const [trainingPlanDrafts, setTrainingPlanDrafts] = useState<
    Record<string, TrainingPlanDraft>
  >({});
  const [expandedApprovedRequestId, setExpandedApprovedRequestId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingRequestId, setUpdatingRequestId] = useState<string | null>(null);
  const [savingApprovedRequestId, setSavingApprovedRequestId] = useState<string | null>(
    null
  );
  const [downloadingRequestId, setDownloadingRequestId] = useState<string | null>(null);

  useEffect(() => {
    setCoachViewMode(isCoach ? "coach" : "user");
  }, [isCoach]);

  const hydratePresentationState = useCallback((requests: CoachTrainingRequest[]) => {
    setDecisionDescriptions((previous) => {
      const next = { ...previous };

      requests.forEach((request) => {
        if (!(request.id in next)) {
          next[request.id] = getDecisionDescription(request);
        }
      });

      return next;
    });

    setTrainingPlanDrafts((previous) => {
      const next = { ...previous };

      requests
        .filter((request) => request.status === "APPROVED")
        .forEach((request) => {
          if (next[request.id]) {
            return;
          }

          const draft = createTrainingPlanDraft(request);
          next[request.id] = {
            ...draft,
            planName: draft.planName || getTrainingPlanName(request),
            existingFileName: draft.existingFileName || getTrainingPlanFileName(request),
            planDescription: draft.planDescription || getTrainingPlanDescription(request),
          };
        });

      return next;
    });
  }, []);

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

  const setDecisionDescription = useCallback((requestId: string, value: string) => {
    setDecisionDescriptions((previous) => ({
      ...previous,
      [requestId]: value,
    }));
  }, []);

  const updateTrainingPlanDraft = useCallback((requestId: string, draft: TrainingPlanDraft) => {
    setTrainingPlanDrafts((previous) => ({
      ...previous,
      [requestId]: draft,
    }));
  }, []);

  const toggleApprovedRequestEditor = useCallback((requestId: string) => {
    setExpandedApprovedRequestId((previous) => (previous === requestId ? null : requestId));
  }, []);

  const updateRequestStatus = useCallback(
    async (
      trainingRequestId: string,
      status: TrainingRequestStatus,
      coachResponse: string
    ) => {
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
        const response = await updateCoachTrainingRequestStatus(
          trainingRequestId,
          mapTrainingRequestStatusToUpdateDto(status, trimmedCoachResponse)
        );
        const normalizedResponse = mapTrainingRequestDtoToModel(response);

        setPendingRequests((previous) => dedupeRequests(upsertRequest(previous, normalizedResponse)));
        setOutgoingRequests((previous) =>
          dedupeRequests(upsertRequest(previous, normalizedResponse))
        );
        setDecisionDescription(trainingRequestId, trimmedCoachResponse);

        if (status === "APPROVED") {
          setApprovedRequests((previous) =>
            dedupeRequests(upsertRequest(previous, normalizedResponse))
          );
          setRejectedRequests((previous) =>
            previous.filter((requestItem) => requestItem.id !== trainingRequestId)
          );
          setClosedRequests((previous) =>
            previous.filter((requestItem) => requestItem.id !== trainingRequestId)
          );
          setTrainingPlanDrafts((previous) => ({
            ...previous,
            [trainingRequestId]:
              previous[trainingRequestId] ?? createTrainingPlanDraft(normalizedResponse),
          }));
          setExpandedApprovedRequestId(trainingRequestId);
        } else {
          setApprovedRequests((previous) =>
            previous.filter((requestItem) => requestItem.id !== trainingRequestId)
          );
          setRejectedRequests((previous) =>
            dedupeRequests(upsertRequest(previous, normalizedResponse))
          );
          setClosedRequests((previous) =>
            previous.filter((requestItem) => requestItem.id !== trainingRequestId)
          );
          setTrainingPlanDrafts((previous) => {
            const next = { ...previous };
            delete next[trainingRequestId];
            return next;
          });
          setExpandedApprovedRequestId((previous) =>
            previous === trainingRequestId ? null : previous
          );
        }

        hydratePresentationState([normalizedResponse]);
        void loadRequests();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update status.");
      } finally {
        setUpdatingRequestId(null);
      }
    },
    [
      hydratePresentationState,
      loadRequests,
      setDecisionDescription,
      updateCoachTrainingRequestStatus,
    ]
  );

  const saveTrainingPlan = useCallback(
    async (requestItem: CoachTrainingRequest) => {
      const draft = trainingPlanDrafts[requestItem.id] ?? createTrainingPlanDraft(requestItem);
      const trimmedPlanName = draft.planName.trim();
      const trimmedPlanDescription = draft.planDescription.trim();

      if (requestItem.status !== "APPROVED") {
        setError("Training plan can only be uploaded for approved requests.");
        return;
      }

      if (!draft.file) {
        setError("Select a PDF or DOCX file to upload the training plan.");
        return;
      }

      setSavingApprovedRequestId(requestItem.id);
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

        const response = await uploadCoachTrainingPlan(requestItem.id, formData);
        const fallbackPlanName = trimmedPlanName || requestItem.planName || null;
        const fallbackPlanDescription =
          trimmedPlanDescription || requestItem.planDescription || null;
        const normalizedResponse = mapClosedTrainingRequestDtoToModel({
          ...response,
          planName: response.planName ?? fallbackPlanName,
          planDescription: response.planDescription ?? fallbackPlanDescription,
          fileName: response.fileName ?? draft.file.name ?? requestItem.fileName,
        });

        setApprovedRequests((previous) =>
          previous.filter((request) => request.id !== requestItem.id)
        );
        setPendingRequests((previous) =>
          previous.filter((request) => request.id !== requestItem.id)
        );
        setRejectedRequests((previous) =>
          previous.filter((request) => request.id !== requestItem.id)
        );
        setClosedRequests((previous) => dedupeRequests(upsertRequest(previous, normalizedResponse)));
        setOutgoingRequests((previous) =>
          dedupeRequests(upsertRequest(previous, normalizedResponse))
        );
        setTrainingPlanDrafts((previous) => ({
          ...previous,
          [requestItem.id]: {
            planName: trimmedPlanName || getTrainingPlanName(normalizedResponse),
            planDescription: normalizedResponse.planDescription ?? trimmedPlanDescription,
            file: null,
            existingFileName: normalizedResponse.fileName ?? draft.file?.name ?? "",
          },
        }));
        hydratePresentationState([normalizedResponse]);
        void loadRequests();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to upload the training plan.");
      } finally {
        setSavingApprovedRequestId(null);
      }
    },
    [hydratePresentationState, loadRequests, trainingPlanDrafts, uploadCoachTrainingPlan]
  );

  const downloadTrainingPlan = useCallback(
    async (requestItem: CoachTrainingRequest) => {
      setDownloadingRequestId(requestItem.id);
      setError(null);

      try {
        const { blob, fileName } = await downloadTrainingPlanFile(requestItem.id);
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(downloadUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to download the training plan.");
      } finally {
        setDownloadingRequestId(null);
      }
    },
    [downloadTrainingPlanFile]
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
