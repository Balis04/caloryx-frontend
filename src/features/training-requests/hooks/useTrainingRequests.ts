import { useTrainingRequestApi } from "@/features/training-request/api/training-request.api";
import type { ClosedTrainingRequestResponseDto } from "@/features/training-request/api/training-request.dto";
import {
  mapClosedTrainingRequestDtoToModel,
  mapTrainingRequestDtoToModel,
  mapTrainingRequestStatusToUpdateDto,
} from "@/features/training-request/lib/training-request.mapper";
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
  getTrainingPlanName,
  upsertRequest,
} from "../utils/training-requests.utils";

export const useTrainingRequests = () => {
  const { request } = useApi();
  const {
    getMyTrainingRequests,
    updateTrainingRequestStatus: updateTrainingRequestStatusRequest,
    uploadTrainingPlan,
  } = useTrainingRequestApi();
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
        getMyTrainingRequests(),
        isTrainer
          ? request<TrainingRequestResponse[]>("/api/coach-profiles/me/training-requests")
          : Promise.resolve([]),
        isTrainer
          ? request<TrainingRequestResponse[]>(
              "/api/coach-profiles/me/training-requests/approved"
            )
          : Promise.resolve([]),
        isTrainer
          ? request<ClosedTrainingRequestResponseDto[]>(
              "/api/coach-profiles/me/training-requests/closed"
            )
          : Promise.resolve([]),
        isTrainer
          ? request<TrainingRequestResponse[]>(
              "/api/coach-profiles/me/training-requests/rejected"
            )
          : Promise.resolve([]),
      ]);

      const mappedOutgoingRequests = outgoingResponse.map(mapTrainingRequestDtoToModel);
      const mappedClosedRequests = closedResponse.map(mapClosedTrainingRequestDtoToModel);

      setOutgoingRequests(mappedOutgoingRequests);
      setPendingRequests(dedupeRequests(pendingResponse));
      setApprovedRequests(dedupeRequests(approvedResponse));
      setClosedRequests(dedupeRequests(mappedClosedRequests));
      setRejectedRequests(dedupeRequests(rejectedResponse));
      setDecisionDescriptions((prev) => {
        const next = { ...prev };

        [...pendingResponse, ...approvedResponse, ...mappedClosedRequests, ...rejectedResponse].forEach(
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
            planDescription:
              currentDraft.planDescription || getTrainingPlanDescription(requestItem),
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
  }, [getMyTrainingRequests, isTrainer, request]);

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
        const response = await updateTrainingRequestStatusRequest(
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
            prev.filter((requestItem) => requestItem.id !== trainingRequestId)
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
    [loadRequests, updateTrainingRequestStatusRequest]
  );

  const saveTrainingPlan = useCallback(
    async (requestItem: TrainingRequestResponse) => {
      const draft = approvedDrafts[requestItem.id] ?? createApprovedDraft(requestItem);
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

        const response = await uploadTrainingPlan(requestItem.id, formData);

        const fallbackTrainingPlanName =
          trimmedPlanName || requestItem.planName || null;
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
        setApprovedDrafts((prev) => ({
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
    [approvedDrafts, loadRequests, uploadTrainingPlan]
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
