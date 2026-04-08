import { useEffect, useMemo, useReducer } from "react";

import { useProfileQuery } from "@/features/profile/hooks/useProfileQuery";
import { isCoachRole } from "@/shared/utils/profileRole";

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

interface State {
  approvedRequests: CoachTrainingRequest[];
  closedRequests: CoachTrainingRequest[];
  coachRequestFilter: CoachRequestFilter;
  coachViewMode: CoachRequestViewMode;
  decisionDescriptions: Record<string, string>;
  downloadingRequestId: string | null;
  error: string | null;
  expandedApprovedRequestId: string | null;
  loading: boolean;
  outgoingRequests: CoachTrainingRequest[];
  pendingRequests: CoachTrainingRequest[];
  rejectedRequests: CoachTrainingRequest[];
  savingApprovedRequestId: string | null;
  trainingPlanDrafts: Record<string, TrainingPlanDraft>;
  updatingRequestId: string | null;
}

type Action =
  | { type: "load/start" }
  | {
      type: "load/success";
      payload: {
        outgoingRequests: CoachTrainingRequest[];
        pendingRequests: CoachTrainingRequest[];
        approvedRequests: CoachTrainingRequest[];
        closedRequests: CoachTrainingRequest[];
        rejectedRequests: CoachTrainingRequest[];
        decisionDescriptions: Record<string, string>;
        trainingPlanDrafts: Record<string, TrainingPlanDraft>;
      };
    }
  | { type: "load/error"; payload: string }
  | { type: "set-view"; payload: CoachRequestViewMode }
  | { type: "set-filter"; payload: CoachRequestFilter }
  | { type: "set-decision"; payload: { requestId: string; value: string } }
  | { type: "toggle-editor"; payload: string }
  | { type: "set-draft"; payload: { requestId: string; draft: TrainingPlanDraft } }
  | { type: "set-updating"; payload: string | null }
  | { type: "set-saving"; payload: string | null }
  | { type: "set-downloading"; payload: string | null }
  | { type: "set-error"; payload: string | null }
  | {
      type: "status-updated";
      payload: {
        request: CoachTrainingRequest;
        nextStatus: "APPROVED" | "REJECTED";
        coachResponse: string;
      };
    }
  | { type: "plan-uploaded"; payload: { request: CoachTrainingRequest; draft: TrainingPlanDraft } };

const initialState: State = {
  approvedRequests: [],
  closedRequests: [],
  coachRequestFilter: "pending",
  coachViewMode: "coach",
  decisionDescriptions: {},
  downloadingRequestId: null,
  error: null,
  expandedApprovedRequestId: null,
  loading: true,
  outgoingRequests: [],
  pendingRequests: [],
  rejectedRequests: [],
  savingApprovedRequestId: null,
  trainingPlanDrafts: {},
  updatingRequestId: null,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "load/start":
      return { ...state, loading: true, error: null };
    case "load/success":
      return { ...state, ...action.payload, loading: false, error: null };
    case "load/error":
      return {
        ...state,
        loading: false,
        error: action.payload,
        approvedRequests: [],
        closedRequests: [],
        outgoingRequests: [],
        pendingRequests: [],
        rejectedRequests: [],
      };
    case "set-view":
      return { ...state, coachViewMode: action.payload };
    case "set-filter":
      return { ...state, coachRequestFilter: action.payload };
    case "set-decision":
      return {
        ...state,
        decisionDescriptions: {
          ...state.decisionDescriptions,
          [action.payload.requestId]: action.payload.value,
        },
      };
    case "toggle-editor":
      return {
        ...state,
        expandedApprovedRequestId:
          state.expandedApprovedRequestId === action.payload ? null : action.payload,
      };
    case "set-draft":
      return {
        ...state,
        trainingPlanDrafts: {
          ...state.trainingPlanDrafts,
          [action.payload.requestId]: action.payload.draft,
        },
      };
    case "set-updating":
      return { ...state, updatingRequestId: action.payload };
    case "set-saving":
      return { ...state, savingApprovedRequestId: action.payload };
    case "set-downloading":
      return { ...state, downloadingRequestId: action.payload };
    case "set-error":
      return { ...state, error: action.payload };
    case "status-updated": {
      const { request, nextStatus, coachResponse } = action.payload;
      if (nextStatus === "APPROVED") {
        return {
          ...state,
          approvedRequests: dedupeRequests(upsertRequest(state.approvedRequests, request)),
          closedRequests: state.closedRequests.filter((item) => item.id !== request.id),
          decisionDescriptions: { ...state.decisionDescriptions, [request.id]: coachResponse },
          expandedApprovedRequestId: request.id,
          outgoingRequests: dedupeRequests(upsertRequest(state.outgoingRequests, request)),
          pendingRequests: dedupeRequests(upsertRequest(state.pendingRequests, request)),
          rejectedRequests: state.rejectedRequests.filter((item) => item.id !== request.id),
          trainingPlanDrafts: {
            ...state.trainingPlanDrafts,
            [request.id]:
              state.trainingPlanDrafts[request.id] ?? createTrainingPlanDraft(request),
          },
        };
      }
      const nextDrafts = { ...state.trainingPlanDrafts };
      delete nextDrafts[request.id];
      return {
        ...state,
        approvedRequests: state.approvedRequests.filter((item) => item.id !== request.id),
        closedRequests: state.closedRequests.filter((item) => item.id !== request.id),
        decisionDescriptions: { ...state.decisionDescriptions, [request.id]: coachResponse },
        expandedApprovedRequestId:
          state.expandedApprovedRequestId === request.id ? null : state.expandedApprovedRequestId,
        outgoingRequests: dedupeRequests(upsertRequest(state.outgoingRequests, request)),
        pendingRequests: dedupeRequests(upsertRequest(state.pendingRequests, request)),
        rejectedRequests: dedupeRequests(upsertRequest(state.rejectedRequests, request)),
        trainingPlanDrafts: nextDrafts,
      };
    }
    case "plan-uploaded":
      return {
        ...state,
        approvedRequests: state.approvedRequests.filter(
          (item) => item.id !== action.payload.request.id
        ),
        closedRequests: dedupeRequests(upsertRequest(state.closedRequests, action.payload.request)),
        outgoingRequests: dedupeRequests(
          upsertRequest(state.outgoingRequests, action.payload.request)
        ),
        pendingRequests: state.pendingRequests.filter(
          (item) => item.id !== action.payload.request.id
        ),
        rejectedRequests: state.rejectedRequests.filter(
          (item) => item.id !== action.payload.request.id
        ),
        trainingPlanDrafts: {
          ...state.trainingPlanDrafts,
          [action.payload.request.id]: action.payload.draft,
        },
      };
    default:
      return state;
  }
};

export const useCoachTrainingRequests = () => {
  const { downloadTrainingPlanFile, getMyTrainingRequests } = useTrainingRequestApi();
  const {
    getCoachTrainingRequests,
    getClosedCoachTrainingRequests,
    updateCoachTrainingRequestStatus,
    uploadCoachTrainingPlan,
  } = useCoachTrainingRequestsApi();
  const { profile, loading: profileLoading } = useProfileQuery();
  const isCoach = isCoachRole(profile?.role);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: "set-view", payload: isCoach ? "coach" : "user" });
  }, [isCoach]);

  const loadRequests = async () => {
    dispatch({ type: "load/start" });
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
      const outgoingRequests = outgoingResponse.map(mapTrainingRequestDtoToModel);
      const pendingRequests = dedupeRequests(pendingResponse.map(mapTrainingRequestDtoToModel));
      const approvedRequests = dedupeRequests(approvedResponse.map(mapTrainingRequestDtoToModel));
      const closedRequests = dedupeRequests(closedResponse.map(mapClosedTrainingRequestDtoToModel));
      const rejectedRequests = dedupeRequests(rejectedResponse.map(mapTrainingRequestDtoToModel));
      const requests = [
        ...outgoingRequests,
        ...pendingRequests,
        ...approvedRequests,
        ...closedRequests,
        ...rejectedRequests,
      ];
      const decisionDescriptions = { ...state.decisionDescriptions };
      const trainingPlanDrafts = { ...state.trainingPlanDrafts };
      requests.forEach((request) => {
        if (!(request.id in decisionDescriptions)) {
          decisionDescriptions[request.id] = getDecisionDescription(request);
        }
      });
      requests
        .filter((request) => request.status === "APPROVED")
        .forEach((request) => {
          if (!trainingPlanDrafts[request.id]) {
            const draft = createTrainingPlanDraft(request);
            trainingPlanDrafts[request.id] = {
              ...draft,
              planName: draft.planName || getTrainingPlanName(request),
              existingFileName: draft.existingFileName || getTrainingPlanFileName(request),
              planDescription: draft.planDescription || getTrainingPlanDescription(request),
            };
          }
        });
      dispatch({
        type: "load/success",
        payload: {
          outgoingRequests,
          pendingRequests,
          approvedRequests,
          closedRequests,
          rejectedRequests,
          decisionDescriptions,
          trainingPlanDrafts,
        },
      });
    } catch (error) {
      dispatch({
        type: "load/error",
        payload: error instanceof Error ? error.message : "Failed to load requests.",
      });
    }
  };

  useEffect(() => {
    if (!profileLoading) {
      void loadRequests();
    }
  }, [profileLoading, isCoach]);

  const visibleRequests = useMemo(() => {
    if (!isCoach || state.coachViewMode === "user") {
      return state.outgoingRequests;
    }
    switch (state.coachRequestFilter) {
      case "approved":
        return state.approvedRequests;
      case "rejected":
        return state.rejectedRequests;
      case "closed":
        return state.closedRequests;
      default:
        return state.pendingRequests;
    }
  }, [isCoach, state]);

  const updateRequestStatus = async (
    trainingRequestId: string,
    status: TrainingRequestStatus,
    coachResponse: string
  ) => {
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
  };

  const saveTrainingPlan = async (requestItem: CoachTrainingRequest) => {
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
  };

  const downloadTrainingPlan = async (requestItem: CoachTrainingRequest) => {
    dispatch({ type: "set-downloading", payload: requestItem.id });
    dispatch({ type: "set-error", payload: null });
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
    } catch (error) {
      dispatch({
        type: "set-error",
        payload:
          error instanceof Error ? error.message : "Failed to download the training plan.",
      });
    } finally {
      dispatch({ type: "set-downloading", payload: null });
    }
  };

  return {
    coachRequestFilter: state.coachRequestFilter,
    coachViewMode: state.coachViewMode,
    decisionDescriptions: state.decisionDescriptions,
    downloadingRequestId: state.downloadingRequestId,
    downloadTrainingPlan,
    error: state.error,
    expandedApprovedRequestId: state.expandedApprovedRequestId,
    isCoach,
    loading: state.loading,
    profileLoading,
    saveTrainingPlan,
    savingApprovedRequestId: state.savingApprovedRequestId,
    setCoachRequestFilter: (value: CoachRequestFilter) =>
      dispatch({ type: "set-filter", payload: value }),
    setCoachViewMode: (value: CoachRequestViewMode) =>
      dispatch({ type: "set-view", payload: value }),
    setDecisionDescription: (requestId: string, value: string) =>
      dispatch({ type: "set-decision", payload: { requestId, value } }),
    toggleApprovedRequestEditor: (requestId: string) =>
      dispatch({ type: "toggle-editor", payload: requestId }),
    trainingPlanDrafts: state.trainingPlanDrafts,
    updateRequestStatus,
    updateTrainingPlanDraft: (requestId: string, draft: TrainingPlanDraft) =>
      dispatch({ type: "set-draft", payload: { requestId, draft } }),
    updatingRequestId: state.updatingRequestId,
    visibleRequests,
  };
};

export type UseCoachTrainingRequestsResult = ReturnType<typeof useCoachTrainingRequests>;
