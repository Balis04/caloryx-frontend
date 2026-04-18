import { useCallback, useState } from "react";

import {
  downloadTrainingPlanFile,
  uploadCoachTrainingPlan,
} from "../api/training-requests.api";
import { createTrainingPlanDraft } from "../lib/training-requests.helpers";
import type { CoachTrainingRequest, TrainingPlanDraft } from "../types";

export const useApprovedTrainingPlanForm = () => {
  const [trainingPlanDrafts, setTrainingPlanDrafts] = useState<
    Record<string, TrainingPlanDraft>
  >({});
  const [expandedApprovedRequestId, setExpandedApprovedRequestId] = useState<
    string | null
  >(null);
  const [downloadingRequestId, setDownloadingRequestId] = useState<
    string | null
  >(null);
  const [savingApprovedRequestId, setSavingApprovedRequestId] = useState<
    string | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const getTrainingPlanDraft = useCallback(
    (request: CoachTrainingRequest) =>
      trainingPlanDrafts[request.id] ?? createTrainingPlanDraft(request),
    [trainingPlanDrafts]
  );

  const updateTrainingPlanDraft = useCallback(
    (requestId: string, draft: TrainingPlanDraft) => {
      setTrainingPlanDrafts((current) => ({
        ...current,
        [requestId]: draft,
      }));
    },
    []
  );

  const openTrainingPlanEditor = useCallback((requestId: string) => {
    setExpandedApprovedRequestId(requestId);
  }, []);

  const toggleApprovedRequestEditor = useCallback((requestId: string) => {
    setExpandedApprovedRequestId((current) =>
      current === requestId ? null : requestId
    );
  }, []);

  const saveTrainingPlan = useCallback(
    async (
      request: CoachTrainingRequest,
      onRequestsChanged: () => Promise<void>
    ) => {
      const draft =
        trainingPlanDrafts[request.id] ?? createTrainingPlanDraft(request);

      if (request.status !== "APPROVED") {
        setError("Training plan can only be uploaded for approved requests.");
        return;
      }

      if (!draft.file) {
        setError("Select a PDF or DOCX file to upload the training plan.");
        return;
      }
      const file = draft.file;

      setSavingApprovedRequestId(request.id);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);
        if (draft.planName.trim()) {
          formData.append("planName", draft.planName.trim());
        }
        if (draft.planDescription.trim()) {
          formData.append("planDescription", draft.planDescription.trim());
        }

        await uploadCoachTrainingPlan(request.id, formData);

        setTrainingPlanDrafts((current) => ({
          ...current,
          [request.id]: {
            existingFileName: file.name,
            file: null,
            planDescription: draft.planDescription.trim(),
            planName:
              draft.planName.trim() || file.name.replace(/\.[^.]+$/, ""),
          },
        }));
        await onRequestsChanged();
      } catch (saveError) {
        setError(
          saveError instanceof Error
            ? saveError.message
            : "Failed to upload the training plan."
        );
      } finally {
        setSavingApprovedRequestId(null);
      }
    },
    [trainingPlanDrafts]
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
          downloadError instanceof Error
            ? downloadError.message
            : "Failed to download the training plan."
        );
      } finally {
        setDownloadingRequestId(null);
      }
    },
    []
  );

  return {
    downloadTrainingPlan,
    downloadingRequestId,
    error,
    expandedApprovedRequestId,
    getTrainingPlanDraft,
    openTrainingPlanEditor,
    saveTrainingPlan,
    savingApprovedRequestId,
    toggleApprovedRequestEditor,
    updateTrainingPlanDraft,
  };
};
