import { useCallback, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import type {
  ClosedTrainingRequestResponseDto,
  TrainingRequestResponseDto,
  UpdateTrainingRequestStatusDto,
} from "../../shared/api/training-request.dto";
import {
  mapClosedTrainingRequestDtoToModel,
  mapTrainingRequestDtoToModel,
  mapTrainingRequestStatusToUpdateDto,
} from "../../shared/lib/training-request.mapper";
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

interface DataState {
  loadRequests: () => Promise<void>;
  setApprovedRequests: Dispatch<SetStateAction<CoachTrainingRequest[]>>;
  setClosedRequests: Dispatch<SetStateAction<CoachTrainingRequest[]>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setOutgoingRequests: Dispatch<SetStateAction<CoachTrainingRequest[]>>;
  setPendingRequests: Dispatch<SetStateAction<CoachTrainingRequest[]>>;
  setRejectedRequests: Dispatch<SetStateAction<CoachTrainingRequest[]>>;
}

interface PresentationState {
  hydratePresentationState: (requests: CoachTrainingRequest[]) => void;
  setDecisionDescription: (requestId: string, value: string) => void;
  setExpandedApprovedRequestId: Dispatch<SetStateAction<string | null>>;
  setTrainingPlanDrafts: Dispatch<SetStateAction<Record<string, TrainingPlanDraft>>>;
  trainingPlanDrafts: Record<string, TrainingPlanDraft>;
}

interface Params {
  downloadTrainingPlanFile: (trainingRequestId: string) => Promise<{
    blob: Blob;
    fileName: string;
  }>;
  updateCoachTrainingRequestStatus: (
    trainingRequestId: string,
    data: UpdateTrainingRequestStatusDto
  ) => Promise<TrainingRequestResponseDto>;
  uploadCoachTrainingPlan: (
    trainingRequestId: string,
    body: FormData
  ) => Promise<ClosedTrainingRequestResponseDto>;
  dataState: DataState;
  presentationState: PresentationState;
}

export const useCoachTrainingRequestsActions = ({
  downloadTrainingPlanFile,
  updateCoachTrainingRequestStatus,
  uploadCoachTrainingPlan,
  dataState,
  presentationState,
}: Params) => {
  const [updatingRequestId, setUpdatingRequestId] = useState<string | null>(null);
  const [savingApprovedRequestId, setSavingApprovedRequestId] = useState<string | null>(
    null
  );
  const [downloadingRequestId, setDownloadingRequestId] = useState<string | null>(null);

  const updateRequestStatus = useCallback(
    async (
      trainingRequestId: string,
      status: TrainingRequestStatus,
      coachResponse: string
    ) => {
      if (status === "PENDING" || status === "CLOSED") {
        dataState.setError("Only APPROVED or REJECTED status updates are allowed.");
        return;
      }

      const trimmedCoachResponse = coachResponse.trim();

      if (!trimmedCoachResponse) {
        dataState.setError("A status comment is required when approving or rejecting a request.");
        return;
      }

      setUpdatingRequestId(trainingRequestId);
      dataState.setError(null);

      try {
        const response = await updateCoachTrainingRequestStatus(
          trainingRequestId,
          mapTrainingRequestStatusToUpdateDto(status, trimmedCoachResponse)
        );
        const normalizedResponse = mapTrainingRequestDtoToModel(response);

        dataState.setPendingRequests((previous) =>
          dedupeRequests(upsertRequest(previous, normalizedResponse))
        );
        dataState.setOutgoingRequests((previous) =>
          dedupeRequests(upsertRequest(previous, normalizedResponse))
        );
        presentationState.setDecisionDescription(trainingRequestId, trimmedCoachResponse);

        if (status === "APPROVED") {
          dataState.setApprovedRequests((previous) =>
            dedupeRequests(upsertRequest(previous, normalizedResponse))
          );
          dataState.setRejectedRequests((previous) =>
            previous.filter((requestItem) => requestItem.id !== trainingRequestId)
          );
          dataState.setClosedRequests((previous) =>
            previous.filter((requestItem) => requestItem.id !== trainingRequestId)
          );
          presentationState.setTrainingPlanDrafts((previous) => ({
            ...previous,
            [trainingRequestId]:
              previous[trainingRequestId] ?? createTrainingPlanDraft(normalizedResponse),
          }));
          presentationState.setExpandedApprovedRequestId(trainingRequestId);
        } else {
          dataState.setApprovedRequests((previous) =>
            previous.filter((requestItem) => requestItem.id !== trainingRequestId)
          );
          dataState.setRejectedRequests((previous) =>
            dedupeRequests(upsertRequest(previous, normalizedResponse))
          );
          dataState.setClosedRequests((previous) =>
            previous.filter((requestItem) => requestItem.id !== trainingRequestId)
          );
          presentationState.setTrainingPlanDrafts((previous) => {
            const next = { ...previous };
            delete next[trainingRequestId];
            return next;
          });
          presentationState.setExpandedApprovedRequestId((previous) =>
            previous === trainingRequestId ? null : previous
          );
        }

        presentationState.hydratePresentationState([normalizedResponse]);
        void dataState.loadRequests();
      } catch (err) {
        dataState.setError(err instanceof Error ? err.message : "Failed to update status.");
      } finally {
        setUpdatingRequestId(null);
      }
    },
    [dataState, presentationState, updateCoachTrainingRequestStatus]
  );

  const saveTrainingPlan = useCallback(
    async (requestItem: CoachTrainingRequest) => {
      const draft =
        presentationState.trainingPlanDrafts[requestItem.id] ??
        createTrainingPlanDraft(requestItem);
      const trimmedPlanName = draft.planName.trim();
      const trimmedPlanDescription = draft.planDescription.trim();

      if (requestItem.status !== "APPROVED") {
        dataState.setError("Training plan can only be uploaded for approved requests.");
        return;
      }

      if (!draft.file) {
        dataState.setError("Select a PDF or DOCX file to upload the training plan.");
        return;
      }

      const uploadedFile = draft.file;
      setSavingApprovedRequestId(requestItem.id);
      dataState.setError(null);

      try {
        const formData = new FormData();
        formData.append("file", uploadedFile);

        if (trimmedPlanName) {
          formData.append("planName", trimmedPlanName);
        }

        if (trimmedPlanDescription) {
          formData.append("planDescription", trimmedPlanDescription);
        }

        const response = await uploadCoachTrainingPlan(requestItem.id, formData);
        const normalizedResponse = mapClosedTrainingRequestDtoToModel({
          ...response,
          planName: response.planName ?? (trimmedPlanName || requestItem.planName || null),
          planDescription:
            response.planDescription ??
            (trimmedPlanDescription || requestItem.planDescription || null),
          fileName: response.fileName ?? uploadedFile.name ?? requestItem.fileName,
        });

        dataState.setApprovedRequests((previous) =>
          previous.filter((request) => request.id !== requestItem.id)
        );
        dataState.setPendingRequests((previous) =>
          previous.filter((request) => request.id !== requestItem.id)
        );
        dataState.setRejectedRequests((previous) =>
          previous.filter((request) => request.id !== requestItem.id)
        );
        dataState.setClosedRequests((previous) =>
          dedupeRequests(upsertRequest(previous, normalizedResponse))
        );
        dataState.setOutgoingRequests((previous) =>
          dedupeRequests(upsertRequest(previous, normalizedResponse))
        );
        presentationState.setTrainingPlanDrafts((previous) => ({
          ...previous,
          [requestItem.id]: {
            planName: trimmedPlanName || getTrainingPlanName(normalizedResponse),
            planDescription: normalizedResponse.planDescription ?? trimmedPlanDescription,
            file: null,
            existingFileName: normalizedResponse.fileName ?? uploadedFile.name,
          },
        }));
        presentationState.hydratePresentationState([normalizedResponse]);
        void dataState.loadRequests();
      } catch (err) {
        dataState.setError(
          err instanceof Error ? err.message : "Failed to upload the training plan."
        );
      } finally {
        setSavingApprovedRequestId(null);
      }
    },
    [dataState, presentationState, uploadCoachTrainingPlan]
  );

  const downloadTrainingPlan = useCallback(
    async (requestItem: CoachTrainingRequest) => {
      setDownloadingRequestId(requestItem.id);
      dataState.setError(null);

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
        dataState.setError(
          err instanceof Error ? err.message : "Failed to download the training plan."
        );
      } finally {
        setDownloadingRequestId(null);
      }
    },
    [dataState, downloadTrainingPlanFile]
  );

  return {
    downloadingRequestId,
    downloadTrainingPlan,
    saveTrainingPlan,
    savingApprovedRequestId,
    updateRequestStatus,
    updatingRequestId,
  };
};
