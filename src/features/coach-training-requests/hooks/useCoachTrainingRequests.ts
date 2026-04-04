import { useTrainingRequestApi } from "@/features/training-request/api/training-request.api";
import {
  mapClosedTrainingRequestDtoToModel,
  mapTrainingRequestDtoToModel,
  mapTrainingRequestStatusToUpdateDto,
} from "@/features/training-request/lib/training-request.mapper";
import { useViewerProfile } from "@/features/profile/hooks/useViewerProfile";
import { isCoachRole } from "@/shared/utils/profileRole";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCoachTrainingRequestsApi } from "../api/coach-training-requests.api";
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
  const { downloadTrainingPlanFile, getMyTrainingRequests } = useTrainingRequestApi();
  const {
    getCoachTrainingRequests,
    getClosedCoachTrainingRequests,
    updateCoachTrainingRequestStatus,
    uploadCoachTrainingPlan,
  } = useCoachTrainingRequestsApi();
  const { profile, loading: profileLoading } = useViewerProfile();
  const isCoach = isCoachRole(profile?.role);

  const [coachViewMode, setCoachViewMode] = useState<CoachRequestViewMode>("coach");
  const [coachRequestFilter, setCoachRequestFilter] =
    useState<CoachRequestFilter>("pending");
  const [pendingRequests, setPendingRequests] = useState<CoachTrainingRequest[]>([]);
  const [approvedRequests, setApprovedRequests] = useState<CoachTrainingRequest[]>([]);
  const [closedRequests, setClosedRequests] = useState<CoachTrainingRequest[]>([]);
  const [rejectedRequests, setRejectedRequests] = useState<CoachTrainingRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<CoachTrainingRequest[]>([]);
  const [decisionDescriptions, setDecisionDescriptions] = useState<Record<string, string>>({});
  const [trainingPlanDrafts, setTrainingPlanDrafts] = useState<Record<string, TrainingPlanDraft>>(
    {}
  );
  const [expandedApprovedRequestId, setExpandedApprovedRequestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingRequestId, setUpdatingRequestId] = useState<string | null>(null);
  const [savingApprovedRequestId, setSavingApprovedRequestId] = useState<string | null>(null);
  const [downloadingRequestId, setDownloadingRequestId] = useState<string | null>(null);

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

      const mappedOutgoingRequests = outgoingResponse.map(mapTrainingRequestDtoToModel);
      const mappedPendingRequests = pendingResponse.map(mapTrainingRequestDtoToModel);
      const mappedApprovedRequests = approvedResponse.map(mapTrainingRequestDtoToModel);
      const mappedClosedRequests = closedResponse.map(mapClosedTrainingRequestDtoToModel);
      const mappedRejectedRequests = rejectedResponse.map(mapTrainingRequestDtoToModel);

      setOutgoingRequests(mappedOutgoingRequests);
      setPendingRequests(dedupeRequests(mappedPendingRequests));
      setApprovedRequests(dedupeRequests(mappedApprovedRequests));
      setClosedRequests(dedupeRequests(mappedClosedRequests));
      setRejectedRequests(dedupeRequests(mappedRejectedRequests));
      setDecisionDescriptions((prev) => {
        const next = { ...prev };

        [
          ...mappedPendingRequests,
          ...mappedApprovedRequests,
          ...mappedClosedRequests,
          ...mappedRejectedRequests,
        ].forEach((requestItem) => {
          if (!next[requestItem.id]) {
            next[requestItem.id] = getDecisionDescription(requestItem);
          }
        });

        return next;
      });
      setTrainingPlanDrafts((prev) => {
        const next = { ...prev };

        mappedApprovedRequests.forEach((requestItem) => {
          const currentDraft = next[requestItem.id];

          if (!currentDraft) {
            next[requestItem.id] = createTrainingPlanDraft(requestItem);
            return;
          }

          next[requestItem.id] = {
            ...currentDraft,
            planName: currentDraft.planName || getTrainingPlanName(requestItem),
            existingFileName: currentDraft.existingFileName || getTrainingPlanFileName(requestItem),
            planDescription:
              currentDraft.planDescription || getTrainingPlanDescription(requestItem),
          };
        });

        return next;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load requests.";
      setError(message);
      setOutgoingRequests([]);
      setPendingRequests([]);
      setApprovedRequests([]);
      setClosedRequests([]);
      setRejectedRequests([]);
    } finally {
      setLoading(false);
    }
  }, [getCoachTrainingRequests, getClosedCoachTrainingRequests, getMyTrainingRequests, isCoach]);

  useEffect(() => {
    if (profileLoading) {
      return;
    }

    void loadRequests();
  }, [loadRequests, profileLoading]);

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

        setPendingRequests((prev) => dedupeRequests(upsertRequest(prev, normalizedResponse)));
        setOutgoingRequests((prev) => dedupeRequests(upsertRequest(prev, normalizedResponse)));
        setDecisionDescriptions((prev) => ({
          ...prev,
          [trainingRequestId]: trimmedCoachResponse,
        }));

        if (status === "APPROVED") {
          setApprovedRequests((prev) => dedupeRequests(upsertRequest(prev, normalizedResponse)));
          setRejectedRequests((prev) =>
            prev.filter((requestItem) => requestItem.id !== trainingRequestId)
          );
          setClosedRequests((prev) =>
            prev.filter((requestItem) => requestItem.id !== trainingRequestId)
          );
          setTrainingPlanDrafts((prev) => ({
            ...prev,
            [trainingRequestId]: prev[trainingRequestId] ?? createTrainingPlanDraft(normalizedResponse),
          }));
          setExpandedApprovedRequestId(trainingRequestId);
        } else {
          setApprovedRequests((prev) =>
            prev.filter((requestItem) => requestItem.id !== trainingRequestId)
          );
          setRejectedRequests((prev) =>
            status === "REJECTED"
              ? dedupeRequests(upsertRequest(prev, normalizedResponse))
              : prev.filter((requestItem) => requestItem.id !== trainingRequestId)
          );
          setClosedRequests((prev) =>
            prev.filter((requestItem) => requestItem.id !== trainingRequestId)
          );
          setTrainingPlanDrafts((prev) => {
            const next = { ...prev };
            delete next[trainingRequestId];
            return next;
          });
          setExpandedApprovedRequestId((prev) =>
            prev === trainingRequestId ? null : prev
          );
        }

        void loadRequests();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update status.";
        setError(message);
      } finally {
        setUpdatingRequestId(null);
      }
    },
    [loadRequests, updateCoachTrainingRequestStatus]
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

        const fallbackTrainingPlanName = trimmedPlanName || requestItem.planName || null;
        const fallbackTrainingPlanDescription =
          trimmedPlanDescription || requestItem.planDescription || null;
        const normalizedResponse = mapClosedTrainingRequestDtoToModel({
          ...response,
          planName: response.planName ?? fallbackTrainingPlanName,
          planDescription: response.planDescription ?? fallbackTrainingPlanDescription,
          fileName: response.fileName ?? draft.file?.name ?? requestItem.fileName,
        });

        setApprovedRequests((prev) =>
          prev.filter((request) => request.id !== requestItem.id)
        );
        setPendingRequests((prev) =>
          prev.filter((request) => request.id !== requestItem.id)
        );
        setRejectedRequests((prev) =>
          prev.filter((request) => request.id !== requestItem.id)
        );
        setClosedRequests((prev) => dedupeRequests(upsertRequest(prev, normalizedResponse)));
        setOutgoingRequests((prev) => dedupeRequests(upsertRequest(prev, normalizedResponse)));
        setTrainingPlanDrafts((prev) => ({
          ...prev,
          [requestItem.id]: {
            planName: trimmedPlanName || getTrainingPlanName(normalizedResponse),
            planDescription:
              normalizedResponse.planDescription ?? trimmedPlanDescription,
            file: null,
            existingFileName: normalizedResponse.fileName ?? draft.file?.name ?? "",
          },
        }));
        void loadRequests();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to upload the training plan.";
        setError(message);
      } finally {
        setSavingApprovedRequestId(null);
      }
    },
    [loadRequests, trainingPlanDrafts, uploadCoachTrainingPlan]
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
        const message =
          err instanceof Error ? err.message : "Failed to download the training plan.";
        setError(message);
      } finally {
        setDownloadingRequestId(null);
      }
    },
    [downloadTrainingPlanFile]
  );

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
    isCoach,
    outgoingRequests,
    pendingRequests,
    rejectedRequests,
    coachRequestFilter,
    coachViewMode,
  ]);

  return {
    decisionDescriptions,
    downloadingRequestId,
    error,
    expandedApprovedRequestId,
    isCoach,
    loading,
    profileLoading,
    savingApprovedRequestId,
    coachRequestFilter,
    coachViewMode,
    trainingPlanDrafts,
    updatingRequestId,
    visibleRequests,
    saveTrainingPlan,
    downloadTrainingPlan,
    setDecisionDescriptions,
    setExpandedApprovedRequestId,
    setCoachRequestFilter,
    setCoachViewMode,
    setTrainingPlanDrafts,
    updateRequestStatus,
  };
};

export type UseCoachTrainingRequestsResult = ReturnType<typeof useCoachTrainingRequests>;
