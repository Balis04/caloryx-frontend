import { useCoachTrainingRequestsApi } from "@/features/training-requests/shared/api/coach-training-requests.api";
import { useTrainingRequestApi } from "@/features/training-requests/shared/api/training-request.api";
import {
  mapClosedTrainingRequestDtoToModel,
  mapTrainingRequestDtoToModel,
  mapTrainingRequestStatusToUpdateDto,
} from "@/features/training-requests/shared/lib/training-request.mapper";
import { useCallback, useState, type Dispatch, type SetStateAction } from "react";
import {
  createTrainingPlanDraft,
  dedupeRequests,
  getTrainingPlanName,
  upsertRequest,
} from "../lib/coach-training-requests.utils";
import type {
  CoachTrainingRequest,
  TrainingPlanDraft,
  TrainingRequestStatus,
} from "../model/coach-training-request.model";

interface Params {
  loadRequests: () => Promise<void>;
  setApprovedRequests: Dispatch<SetStateAction<CoachTrainingRequest[]>>;
  setClosedRequests: Dispatch<SetStateAction<CoachTrainingRequest[]>>;
  setDecisionDescriptions: Dispatch<SetStateAction<Record<string, string>>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setExpandedApprovedRequestId: Dispatch<SetStateAction<string | null>>;
  setOutgoingRequests: Dispatch<SetStateAction<CoachTrainingRequest[]>>;
  setPendingRequests: Dispatch<SetStateAction<CoachTrainingRequest[]>>;
  setRejectedRequests: Dispatch<SetStateAction<CoachTrainingRequest[]>>;
  setTrainingPlanDrafts: Dispatch<SetStateAction<Record<string, TrainingPlanDraft>>>;
  trainingPlanDrafts: Record<string, TrainingPlanDraft>;
}

export const useCoachTrainingRequestActions = ({
  loadRequests,
  setApprovedRequests,
  setClosedRequests,
  setDecisionDescriptions,
  setError,
  setExpandedApprovedRequestId,
  setOutgoingRequests,
  setPendingRequests,
  setRejectedRequests,
  setTrainingPlanDrafts,
  trainingPlanDrafts,
}: Params) => {
  const { downloadTrainingPlanFile } = useTrainingRequestApi();
  const { updateCoachTrainingRequestStatus, uploadCoachTrainingPlan } =
    useCoachTrainingRequestsApi();
  const [updatingRequestId, setUpdatingRequestId] = useState<string | null>(null);
  const [savingApprovedRequestId, setSavingApprovedRequestId] = useState<string | null>(null);
  const [downloadingRequestId, setDownloadingRequestId] = useState<string | null>(null);

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
            [trainingRequestId]:
              prev[trainingRequestId] ?? createTrainingPlanDraft(normalizedResponse),
          }));
          setExpandedApprovedRequestId(trainingRequestId);
        } else {
          setApprovedRequests((prev) =>
            prev.filter((requestItem) => requestItem.id !== trainingRequestId)
          );
          setRejectedRequests((prev) =>
            dedupeRequests(upsertRequest(prev, normalizedResponse))
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
        setError(err instanceof Error ? err.message : "Failed to update status.");
      } finally {
        setUpdatingRequestId(null);
      }
    },
    [
      loadRequests,
      setApprovedRequests,
      setClosedRequests,
      setDecisionDescriptions,
      setError,
      setExpandedApprovedRequestId,
      setOutgoingRequests,
      setPendingRequests,
      setRejectedRequests,
      setTrainingPlanDrafts,
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

        setApprovedRequests((prev) => prev.filter((request) => request.id !== requestItem.id));
        setPendingRequests((prev) => prev.filter((request) => request.id !== requestItem.id));
        setRejectedRequests((prev) => prev.filter((request) => request.id !== requestItem.id));
        setClosedRequests((prev) => dedupeRequests(upsertRequest(prev, normalizedResponse)));
        setOutgoingRequests((prev) => dedupeRequests(upsertRequest(prev, normalizedResponse)));
        setTrainingPlanDrafts((prev) => ({
          ...prev,
          [requestItem.id]: {
            planName: trimmedPlanName || getTrainingPlanName(normalizedResponse),
            planDescription:
              normalizedResponse.planDescription ?? trimmedPlanDescription,
            file: null,
            existingFileName:
              normalizedResponse.fileName ?? draft.file?.name ?? "",
          },
        }));
        void loadRequests();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to upload the training plan."
        );
      } finally {
        setSavingApprovedRequestId(null);
      }
    },
    [
      loadRequests,
      setApprovedRequests,
      setClosedRequests,
      setError,
      setOutgoingRequests,
      setPendingRequests,
      setRejectedRequests,
      setTrainingPlanDrafts,
      trainingPlanDrafts,
      uploadCoachTrainingPlan,
    ]
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
        setError(
          err instanceof Error ? err.message : "Failed to download the training plan."
        );
      } finally {
        setDownloadingRequestId(null);
      }
    },
    [downloadTrainingPlanFile, setError]
  );

  return {
    downloadTrainingPlan,
    downloadingRequestId,
    saveTrainingPlan,
    savingApprovedRequestId,
    updateRequestStatus,
    updatingRequestId,
  };
};
