import { GlassCard } from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";

import { createTrainingPlanDraft } from "../lib/coach-training-requests.utils";
import type {
  CoachRequestFilter,
  CoachRequestViewMode,
  CoachTrainingRequest,
  TrainingPlanDraft,
  TrainingRequestStatus,
} from "../model/coach-training-request.model";
import CoachRequestCard from "./CoachRequestCard";
import TrainingRequestsHeader from "./TrainingRequestsHeader";
import UserRequestCard from "./UserRequestCard";

interface Props {
  coachRequestFilter: CoachRequestFilter;
  coachViewMode: CoachRequestViewMode;
  decisionDescriptions: Record<string, string>;
  downloadingRequestId: string | null;
  error: string | null;
  expandedApprovedRequestId: string | null;
  isCoach: boolean;
  onFilterChange: (value: CoachRequestFilter) => void;
  onViewModeChange: (value: CoachRequestViewMode) => void;
  onDownloadTrainingPlan: (request: CoachTrainingRequest) => Promise<void>;
  onSaveTrainingPlan: (request: CoachTrainingRequest) => Promise<void>;
  onDecisionDescriptionChange: (requestId: string, value: string) => void;
  onToggleTrainingPlanEditor: (requestId: string) => void;
  onTrainingPlanDraftChange: (requestId: string, draft: TrainingPlanDraft) => void;
  onUpdateRequestStatus: (
    trainingRequestId: string,
    status: TrainingRequestStatus,
    coachResponse: string
  ) => Promise<void>;
  savingApprovedRequestId: string | null;
  showCoachIncomingRequests: boolean;
  trainingPlanDrafts: Record<string, TrainingPlanDraft>;
  updatingRequestId: string | null;
  visibleRequests: CoachTrainingRequest[];
}

export default function TrainingRequestsContent({
  coachRequestFilter,
  coachViewMode,
  decisionDescriptions,
  downloadingRequestId,
  error,
  expandedApprovedRequestId,
  isCoach,
  onFilterChange,
  onViewModeChange,
  onDecisionDescriptionChange,
  onDownloadTrainingPlan,
  onSaveTrainingPlan,
  onToggleTrainingPlanEditor,
  onTrainingPlanDraftChange,
  onUpdateRequestStatus,
  savingApprovedRequestId,
  showCoachIncomingRequests,
  trainingPlanDrafts,
  updatingRequestId,
  visibleRequests,
}: Props) {
  const coachIncomingEmptyMessages: Record<CoachRequestFilter, string> = {
    pending: "There are currently no pending requests.",
    approved: "There are currently no approved requests.",
    rejected: "There are currently no rejected requests.",
    closed: "There are currently no completed requests.",
  };

  const emptyMessage = showCoachIncomingRequests
    ? coachIncomingEmptyMessages[coachRequestFilter]
    : "You have not sent any training plan requests yet.";

  return (
    <div className="space-y-6">
      {error ? (
        <GlassCard className="border-red-300/70 bg-red-50/70">
          <CardContent className="p-4 text-sm text-red-700">{error}</CardContent>
        </GlassCard>
      ) : null}

      <TrainingRequestsHeader
        isCoach={isCoach}
        showCoachIncomingRequests={showCoachIncomingRequests}
        coachRequestFilter={coachRequestFilter}
        coachViewMode={coachViewMode}
        onFilterChange={onFilterChange}
        onViewModeChange={onViewModeChange}
      />

      {visibleRequests.length === 0 ? (
        <GlassCard>
          <CardContent className="py-16 text-center">
            <p className="text-lg font-semibold text-slate-950">{emptyMessage}</p>
            <p className="mt-2 text-sm text-slate-600">
              Change the active view or come back later when a new request arrives.
            </p>
          </CardContent>
        </GlassCard>
      ) : showCoachIncomingRequests ? (
        <div className="grid gap-6">
          {visibleRequests.map((request) => (
            <CoachRequestCard
              key={request.id}
              approvedDraft={trainingPlanDrafts[request.id] ?? createTrainingPlanDraft(request)}
              decisionDescription={decisionDescriptions[request.id] ?? ""}
              downloadingRequestId={downloadingRequestId}
              expandedApprovedRequestId={expandedApprovedRequestId}
              filter={coachRequestFilter}
              onApprovedDraftChange={(draft) => onTrainingPlanDraftChange(request.id, draft)}
              onDownloadTrainingPlan={() => void onDownloadTrainingPlan(request)}
              onDecisionDescriptionChange={(value) =>
                onDecisionDescriptionChange(request.id, value)
              }
              onSaveTrainingPlan={() => void onSaveTrainingPlan(request)}
              onStatusChange={(status) =>
                void onUpdateRequestStatus(
                  request.id,
                  status,
                  decisionDescriptions[request.id] ?? ""
                )
              }
              onToggleTrainingPlanEditor={() => onToggleTrainingPlanEditor(request.id)}
              request={request}
              savingApprovedRequestId={savingApprovedRequestId}
              updatingRequestId={updatingRequestId}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-6">
          {visibleRequests.map((request) => (
            <UserRequestCard
              key={request.id}
              downloadingRequestId={downloadingRequestId}
              onDownloadTrainingPlan={() => void onDownloadTrainingPlan(request)}
              request={request}
            />
          ))}
        </div>
      )}
    </div>
  );
}
