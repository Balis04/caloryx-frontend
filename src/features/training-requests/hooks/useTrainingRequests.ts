import { useViewerProfile } from "@/features/profile/hooks/useViewerProfile";
import { isCoachRole } from "@/shared/utils/profileRole";
import { useApi } from "@/hooks/useApi";
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  ApprovedRequestDraft,
  TrainerRequestFilter,
  TrainerViewMode,
  TrainingRequestResponse,
  TrainingRequestStatus,
} from "../types/training-requests.types";
import {
  createApprovedDraft,
  dedupeRequests,
  getDecisionDescription,
  getTrainingPlanDescription,
  getTrainingPlanFileName,
  getTrainingPlanFileUrl,
  getTrainingPlanName,
  TRAINING_PLAN_UPLOAD_ENDPOINT,
  upsertRequest,
} from "../utils/training-requests.utils";

export const useTrainingRequests = () => {
  const { request } = useApi();
  const { profile, loading: profileLoading } = useViewerProfile();
  const isTrainer = isCoachRole(profile?.role);

  const [trainerViewMode, setTrainerViewMode] = useState<TrainerViewMode>("trainer");
  const [trainerRequestFilter, setTrainerRequestFilter] =
    useState<TrainerRequestFilter>("pending");
  const [pendingRequests, setPendingRequests] = useState<TrainingRequestResponse[]>([]);
  const [approvedRequests, setApprovedRequests] = useState<TrainingRequestResponse[]>([]);
  const [closedRequests, setClosedRequests] = useState<TrainingRequestResponse[]>([]);
  const [rejectedRequests, setRejectedRequests] = useState<TrainingRequestResponse[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<TrainingRequestResponse[]>([]);
  const [decisionDescriptions, setDecisionDescriptions] = useState<Record<string, string>>({});
  const [approvedDrafts, setApprovedDrafts] = useState<Record<string, ApprovedRequestDraft>>({});
  const [expandedApprovedRequestId, setExpandedApprovedRequestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingRequestId, setUpdatingRequestId] = useState<string | null>(null);
  const [savingApprovedRequestId, setSavingApprovedRequestId] = useState<string | null>(null);

  useEffect(() => {
    setTrainerViewMode(isTrainer ? "trainer" : "user");
  }, [isTrainer]);

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
        request<TrainingRequestResponse[]>("/api/training-requests/me"),
        isTrainer
          ? request<TrainingRequestResponse[]>("/api/coach-profiles/me/training-requests")
          : Promise.resolve([]),
        isTrainer
          ? request<TrainingRequestResponse[]>(
              "/api/coach-profiles/me/training-requests/approved"
            )
          : Promise.resolve([]),
        isTrainer
          ? request<TrainingRequestResponse[]>(
              "/api/coach-profiles/me/training-requests/closed"
            )
          : Promise.resolve([]),
        isTrainer
          ? request<TrainingRequestResponse[]>(
              "/api/coach-profiles/me/training-requests/rejected"
            )
          : Promise.resolve([]),
      ]);

      setOutgoingRequests(outgoingResponse);
      setPendingRequests(dedupeRequests(pendingResponse));
      setApprovedRequests(dedupeRequests(approvedResponse));
      setClosedRequests(dedupeRequests(closedResponse));
      setRejectedRequests(dedupeRequests(rejectedResponse));
      setDecisionDescriptions((prev) => {
        const next = { ...prev };

        [...pendingResponse, ...approvedResponse, ...closedResponse, ...rejectedResponse].forEach(
          (requestItem) => {
            if (!next[requestItem.id]) {
              next[requestItem.id] = getDecisionDescription(requestItem);
            }
          }
        );

        return next;
      });
      setApprovedDrafts((prev) => {
        const next = { ...prev };

        approvedResponse.forEach((requestItem) => {
          const currentDraft = next[requestItem.id];

          if (!currentDraft) {
            next[requestItem.id] = createApprovedDraft(requestItem);
            return;
          }

          next[requestItem.id] = {
            ...currentDraft,
            planName: currentDraft.planName || getTrainingPlanName(requestItem),
            existingFileName: currentDraft.existingFileName || getTrainingPlanFileName(requestItem),
            existingFileUrl: currentDraft.existingFileUrl || getTrainingPlanFileUrl(requestItem),
            description: currentDraft.description || getTrainingPlanDescription(requestItem),
          };
        });

        return next;
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load requests.";
      setError(message);
      setOutgoingRequests([]);
      setPendingRequests([]);
      setApprovedRequests([]);
      setClosedRequests([]);
      setRejectedRequests([]);
    } finally {
      setLoading(false);
    }
  }, [isTrainer, request]);

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
      description: string
    ) => {
      const trimmedDescription = description.trim();

      if (!trimmedDescription) {
        setError("A status comment is required when approving or rejecting a request.");
        return;
      }

      setUpdatingRequestId(trainingRequestId);
      setError(null);

      try {
        const response = await request<TrainingRequestResponse>(
          `/api/training-requests/${trainingRequestId}/status`,
          {
            method: "PATCH",
            body: { status, description: trimmedDescription },
          }
        );

        const normalizedResponse = {
          ...response,
          description: getDecisionDescription(response) || trimmedDescription,
        };

        setPendingRequests((prev) => dedupeRequests(upsertRequest(prev, normalizedResponse)));
        setOutgoingRequests((prev) => dedupeRequests(upsertRequest(prev, normalizedResponse)));
        setDecisionDescriptions((prev) => ({
          ...prev,
          [trainingRequestId]: trimmedDescription,
        }));

        if (status === "APPROVED") {
          setApprovedRequests((prev) => dedupeRequests(upsertRequest(prev, normalizedResponse)));
          setRejectedRequests((prev) =>
            prev.filter((requestItem) => requestItem.id !== trainingRequestId)
          );
          setClosedRequests((prev) =>
            prev.filter((requestItem) => requestItem.id !== trainingRequestId)
          );
          setApprovedDrafts((prev) => ({
            ...prev,
            [trainingRequestId]: prev[trainingRequestId] ?? createApprovedDraft(normalizedResponse),
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
            status === "CLOSED"
              ? dedupeRequests(upsertRequest(prev, normalizedResponse))
              : prev.filter((requestItem) => requestItem.id !== trainingRequestId)
          );
          setApprovedDrafts((prev) => {
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
        const message =
          err instanceof Error ? err.message : "Failed to update status.";
        setError(message);
      } finally {
        setUpdatingRequestId(null);
      }
    },
    [loadRequests, request]
  );

  const saveTrainingPlan = useCallback(
    async (requestItem: TrainingRequestResponse) => {
      const draft = approvedDrafts[requestItem.id] ?? createApprovedDraft(requestItem);
      const trimmedPlanName = draft.planName.trim();
      const trimmedDescription = draft.description.trim();

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

        if (trimmedDescription) {
          formData.append("description", trimmedDescription);
        }

        const response = await request<TrainingRequestResponse>(
          TRAINING_PLAN_UPLOAD_ENDPOINT(requestItem.id),
          {
            method: "POST",
            body: formData,
          }
        );

        const fallbackTrainingPlanName =
          trimmedPlanName || requestItem.planName || null;
        const fallbackTrainingPlanDescription =
          trimmedDescription || requestItem.planDescription || null;
        const nextTrainingPlanName =
          response.planName ?? fallbackTrainingPlanName;
        const nextTrainingPlanDescription =
          response.planDescription ?? fallbackTrainingPlanDescription;
        const nextTrainingPlanFileName =
          response.fileName ?? draft.file?.name ?? requestItem.fileName;
        const nextTrainingPlanFileUrl =
          response.fileUrl ??
          draft.existingFileUrl ??
          requestItem.fileUrl;

        const normalizedResponse = {
          ...requestItem,
          ...response,
          trainingPlanName: nextTrainingPlanName,
          trainingPlanDescription: nextTrainingPlanDescription,
          trainingPlanFileName: nextTrainingPlanFileName,
          trainingPlanFileUrl: nextTrainingPlanFileUrl,
        };

        setApprovedRequests((prev) => dedupeRequests(upsertRequest(prev, normalizedResponse)));
        setPendingRequests((prev) => dedupeRequests(upsertRequest(prev, normalizedResponse)));
        setOutgoingRequests((prev) => dedupeRequests(upsertRequest(prev, normalizedResponse)));
        setApprovedDrafts((prev) => ({
          ...prev,
          [requestItem.id]: {
            planName: trimmedPlanName || getTrainingPlanName(normalizedResponse),
            description: normalizedResponse.trainingPlanDescription ?? trimmedDescription,
            file: null,
            existingFileName: normalizedResponse.trainingPlanFileName ?? draft.file?.name ?? "",
            existingFileUrl: normalizedResponse.trainingPlanFileUrl ?? draft.existingFileUrl,
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
    [approvedDrafts, loadRequests, request]
  );

  const visibleRequests = useMemo(() => {
    if (!isTrainer || trainerViewMode === "user") {
      return outgoingRequests;
    }

    switch (trainerRequestFilter) {
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
    isTrainer,
    outgoingRequests,
    pendingRequests,
    rejectedRequests,
    trainerRequestFilter,
    trainerViewMode,
  ]);

  return {
    decisionDescriptions,
    approvedDrafts,
    error,
    expandedApprovedRequestId,
    isTrainer,
    loading,
    profileLoading,
    savingApprovedRequestId,
    trainerRequestFilter,
    trainerViewMode,
    updatingRequestId,
    visibleRequests,
    setApprovedDrafts,
    setDecisionDescriptions,
    setExpandedApprovedRequestId,
    setTrainerRequestFilter,
    setTrainerViewMode,
    saveTrainingPlan,
    updateRequestStatus,
  };
};
