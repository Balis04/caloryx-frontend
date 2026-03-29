import { Card, CardContent } from "@/components/ui/card";
import CoachRequestCard from "../components/CoachRequestCard";
import TrainingRequestsHeader from "../components/TrainingRequestsHeader";
import UserRequestCard from "../components/UserRequestCard";
import { useCoachTrainingRequests } from "../hooks/useCoachTrainingRequests";
import { createTrainingPlanDraft } from "../lib/coach-training-requests.utils";

export default function CoachTrainingRequestsPage() {
  const {
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
    downloadTrainingPlan,
    saveTrainingPlan,
    setDecisionDescriptions,
    setExpandedApprovedRequestId,
    setCoachRequestFilter,
    setCoachViewMode,
    setTrainingPlanDrafts,
    updateRequestStatus,
  } = useCoachTrainingRequests();

  const showCoachIncomingRequests = isCoach && coachViewMode === "coach";

  if (profileLoading || loading) {
    return <div className="p-10 italic text-muted-foreground">Loading requests...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-muted/30 px-4 py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        {error && (
          <Card className="border-red-300 bg-red-50">
            <CardContent className="p-4 text-sm text-red-700">{error}</CardContent>
          </Card>
        )}

        <Card className="border-t-4 border-t-primary shadow-lg">
          <TrainingRequestsHeader
            isCoach={isCoach}
            showCoachIncomingRequests={showCoachIncomingRequests}
            coachRequestFilter={coachRequestFilter}
            coachViewMode={coachViewMode}
            onFilterChange={setCoachRequestFilter}
            onViewModeChange={setCoachViewMode}
          />

          <CardContent className="space-y-6 pt-6">
            {visibleRequests.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="p-6 text-sm text-muted-foreground">
                  {showCoachIncomingRequests
                    ? coachRequestFilter === "pending"
                      ? "There are currently no pending requests."
                      : coachRequestFilter === "approved"
                        ? "There are currently no approved requests."
                        : coachRequestFilter === "rejected"
                          ? "There are currently no rejected requests."
                          : "There are currently no completed requests."
                    : "You have not sent any training plan requests yet."}
                </CardContent>
              </Card>
            ) : showCoachIncomingRequests ? (
              <div className="grid gap-6">
                {visibleRequests.map((request) => (
                  <CoachRequestCard
                    key={request.id}
                    approvedDraft={
                      trainingPlanDrafts[request.id] ?? createTrainingPlanDraft(request)
                    }
                    decisionDescription={decisionDescriptions[request.id] ?? ""}
                    downloadingRequestId={downloadingRequestId}
                    expandedApprovedRequestId={expandedApprovedRequestId}
                    filter={coachRequestFilter}
                    onApprovedDraftChange={(draft) =>
                      setTrainingPlanDrafts((prev) => ({ ...prev, [request.id]: draft }))
                    }
                    onDownloadTrainingPlan={() => void downloadTrainingPlan(request)}
                    onDecisionDescriptionChange={(value) =>
                      setDecisionDescriptions((prev) => ({ ...prev, [request.id]: value }))
                    }
                    onSaveTrainingPlan={() => void saveTrainingPlan(request)}
                    onStatusChange={(status) =>
                      void updateRequestStatus(
                        request.id,
                        status,
                        decisionDescriptions[request.id] ?? ""
                      )
                    }
                    onToggleTrainingPlanEditor={() =>
                      setExpandedApprovedRequestId((prev) =>
                        prev === request.id ? null : request.id
                      )
                    }
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
                    onDownloadTrainingPlan={() => void downloadTrainingPlan(request)}
                    request={request}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
