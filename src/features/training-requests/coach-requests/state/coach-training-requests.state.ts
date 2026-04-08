import {
  createTrainingPlanDraft,
  dedupeRequests,
  upsertRequest,
} from "../lib/coach-training-requests.utils";
import type {
  CoachRequestFilter,
  CoachRequestViewMode,
  CoachTrainingRequest,
  TrainingPlanDraft,
} from "../model/coach-training-request.model";

export interface CoachTrainingRequestsState {
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

export interface CoachTrainingRequestsLoadPayload {
  approvedRequests: CoachTrainingRequest[];
  closedRequests: CoachTrainingRequest[];
  decisionDescriptions: Record<string, string>;
  outgoingRequests: CoachTrainingRequest[];
  pendingRequests: CoachTrainingRequest[];
  rejectedRequests: CoachTrainingRequest[];
  trainingPlanDrafts: Record<string, TrainingPlanDraft>;
}

export type CoachTrainingRequestsAction =
  | { type: "load/start" }
  | { type: "load/success"; payload: CoachTrainingRequestsLoadPayload }
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

export const initialCoachTrainingRequestsState: CoachTrainingRequestsState = {
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

export const coachTrainingRequestsReducer = (
  state: CoachTrainingRequestsState,
  action: CoachTrainingRequestsAction
): CoachTrainingRequestsState => {
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
