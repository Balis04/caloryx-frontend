import { useCallback } from "react";
import type { Dispatch } from "react";

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
  getTrainingPlanName,
} from "../lib/coach-training-requests.utils";
import type {
  CoachTrainingRequest,
  TrainingPlanDraft,
  TrainingRequestStatus,
} from "../model/coach-training-request.model";
import type {
  CoachTrainingRequestsAction,
  CoachTrainingRequestsState,
} from "../state/coach-training-requests.state";

interface UseCoachTrainingRequestsActionsParams {
  downloadTrainingPlanFile: (trainingRequestId: string) => Promise<{ blob: Blob; fileName: string }>;
  dispatch: Dispatch<CoachTrainingRequestsAction>;
  loadRequests: () => Promise<void>;
  state: CoachTrainingRequestsState;
  updateCoachTrainingRequestStatus: (
    trainingRequestId: string,
    data: UpdateTrainingRequestStatusDto
  ) => Promise<TrainingRequestResponseDto>;
  uploadCoachTrainingPlan: (
    trainingRequestId: string,
    body: FormData
  ) => Promise<ClosedTrainingRequestResponseDto>;
}

const triggerFileDownload = (blob: Blob, fileName: string) => {
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(downloadUrl);
};

export const useCoachTrainingRequestsActions = ({
  downloadTrainingPlanFile,
  dispatch,
  loadRequests,
  state,
  updateCoachTrainingRequestStatus,
  uploadCoachTrainingPlan,
}: UseCoachTrainingRequestsActionsParams) => {
  const updateRequestStatus = useCallback(
    async (trainingRequestId: string, status: TrainingRequestStatus, coachResponse: string) => {
      if (status === "PENDING" || status === "CLOSED") {
        dispatch({
          type: "set-error",
          payload: "Only APPROVED or REJECTED status updates are allowed.",
        });
        return;
      }

      const trimmedCoachResponse = coachResponse.trim();
      if (!trimmedCoachResponse) {
        dispatch({
          type: "set-error",
          payload: "A status comment is required when approving or rejecting a request.",
        });
        return;
      }

      dispatch({ type: "set-updating", payload: trainingRequestId });
      dispatch({ type: "set-error", payload: null });

      try {
        const response = await updateCoachTrainingRequestStatus(
          trainingRequestId,
          mapTrainingRequestStatusToUpdateDto(status, trimmedCoachResponse)
        );

        dispatch({
          type: "status-updated",
          payload: {
            request: mapTrainingRequestDtoToModel(response),
            nextStatus: status,
            coachResponse: trimmedCoachResponse,
          },
        });

        void loadRequests();
      } catch (error) {
        dispatch({
          type: "set-error",
          payload: error instanceof Error ? error.message : "Failed to update status.",
        });
      } finally {
        dispatch({ type: "set-updating", payload: null });
      }
    },
    [dispatch, loadRequests, updateCoachTrainingRequestStatus]
  );

  const saveTrainingPlan = useCallback(
    async (requestItem: CoachTrainingRequest) => {
      const draft = state.trainingPlanDrafts[requestItem.id] ?? createTrainingPlanDraft(requestItem);
      const trimmedPlanName = draft.planName.trim();
      const trimmedPlanDescription = draft.planDescription.trim();

      if (requestItem.status !== "APPROVED") {
        dispatch({
          type: "set-error",
          payload: "Training plan can only be uploaded for approved requests.",
        });
        return;
      }

      if (!draft.file) {
        dispatch({
          type: "set-error",
          payload: "Select a PDF or DOCX file to upload the training plan.",
        });
        return;
      }

      const uploadedFile = draft.file;
      dispatch({ type: "set-saving", payload: requestItem.id });
      dispatch({ type: "set-error", payload: null });

      try {
        const formData = new FormData();
        formData.append("file", uploadedFile);
        if (trimmedPlanName) formData.append("planName", trimmedPlanName);
        if (trimmedPlanDescription) formData.append("planDescription", trimmedPlanDescription);

        const response = await uploadCoachTrainingPlan(requestItem.id, formData);
        const normalizedResponse = mapClosedTrainingRequestDtoToModel({
          ...response,
          fileName: response.fileName ?? uploadedFile.name ?? requestItem.fileName,
          planDescription:
            response.planDescription ??
            (trimmedPlanDescription || requestItem.planDescription || null),
          planName: response.planName ?? (trimmedPlanName || requestItem.planName || null),
        });

        dispatch({
          type: "plan-uploaded",
          payload: {
            request: normalizedResponse,
            draft: {
              existingFileName: normalizedResponse.fileName ?? uploadedFile.name,
              file: null,
              planDescription: normalizedResponse.planDescription ?? trimmedPlanDescription,
              planName: trimmedPlanName || getTrainingPlanName(normalizedResponse),
            },
          },
        });

        void loadRequests();
      } catch (error) {
        dispatch({
          type: "set-error",
          payload:
            error instanceof Error ? error.message : "Failed to upload the training plan.",
        });
      } finally {
        dispatch({ type: "set-saving", payload: null });
      }
    },
    [dispatch, loadRequests, state.trainingPlanDrafts, uploadCoachTrainingPlan]
  );

  const downloadTrainingPlan = useCallback(
    async (requestItem: CoachTrainingRequest) => {
      dispatch({ type: "set-downloading", payload: requestItem.id });
      dispatch({ type: "set-error", payload: null });

      try {
        const { blob, fileName } = await downloadTrainingPlanFile(requestItem.id);
        triggerFileDownload(blob, fileName);
      } catch (error) {
        dispatch({
          type: "set-error",
          payload:
            error instanceof Error ? error.message : "Failed to download the training plan.",
        });
      } finally {
        dispatch({ type: "set-downloading", payload: null });
      }
    },
    [dispatch, downloadTrainingPlanFile]
  );

  const updateTrainingPlanDraft = useCallback(
    (requestId: string, draft: TrainingPlanDraft) =>
      dispatch({ type: "set-draft", payload: { requestId, draft } }),
    [dispatch]
  );

  const setDecisionDescription = useCallback(
    (requestId: string, value: string) =>
      dispatch({ type: "set-decision", payload: { requestId, value } }),
    [dispatch]
  );

  const toggleApprovedRequestEditor = useCallback(
    (requestId: string) => dispatch({ type: "toggle-editor", payload: requestId }),
    [dispatch]
  );

  return {
    downloadTrainingPlan,
    saveTrainingPlan,
    setDecisionDescription,
    toggleApprovedRequestEditor,
    updateRequestStatus,
    updateTrainingPlanDraft,
  };
};
