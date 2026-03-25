import { Card, CardContent } from "@/components/ui/card";
import TrainerRequestCard from "../components/TrainerRequestCard";
import TrainingRequestsHeader from "../components/TrainingRequestsHeader";
import UserRequestCard from "../components/UserRequestCard";
import { useTrainingRequests } from "../hooks/useTrainingRequests";

export default function TrainingRequestsPage() {
  const {
    approvedDrafts,
    decisionDescriptions,
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
    saveTrainingPlan,
    setApprovedDrafts,
    setDecisionDescriptions,
    setExpandedApprovedRequestId,
    setTrainerRequestFilter,
    setTrainerViewMode,
    updateRequestStatus,
  } = useTrainingRequests();

  const showTrainerIncomingRequests = isTrainer && trainerViewMode === "trainer";

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
            isTrainer={isTrainer}
            showTrainerIncomingRequests={showTrainerIncomingRequests}
            trainerRequestFilter={trainerRequestFilter}
            trainerViewMode={trainerViewMode}
            onFilterChange={setTrainerRequestFilter}
            onViewModeChange={setTrainerViewMode}
          />

          <CardContent className="space-y-6 pt-6">
            {visibleRequests.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="p-6 text-sm text-muted-foreground">
                  {showTrainerIncomingRequests
                    ? trainerRequestFilter === "pending"
                      ? "There are currently no pending requests."
                      : trainerRequestFilter === "approved"
                        ? "There are currently no approved requests."
                        : trainerRequestFilter === "rejected"
                          ? "There are currently no rejected requests."
                          : "There are currently no completed requests."
                    : "You have not sent any training plan requests yet."}
                </CardContent>
              </Card>
            ) : showTrainerIncomingRequests ? (
              <div className="grid gap-6">
                {visibleRequests.map((request) => (
                  <TrainerRequestCard
                    key={request.id}
                    approvedDraft={approvedDrafts[request.id]}
                    decisionDescription={decisionDescriptions[request.id] ?? ""}
                    expandedApprovedRequestId={expandedApprovedRequestId}
                    filter={trainerRequestFilter}
                    onApprovedDraftChange={(draft) =>
                      setApprovedDrafts((prev) => ({ ...prev, [request.id]: draft }))
                    }
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
                  <UserRequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
