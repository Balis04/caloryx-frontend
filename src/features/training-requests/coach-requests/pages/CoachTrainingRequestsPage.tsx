import { CaloriexPage, GlassCard } from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";
import CoachRequestCard from "../components/CoachRequestCard";
import TrainingRequestsHeader from "../components/TrainingRequestsHeader";
import UserRequestCard from "../components/UserRequestCard";
import { createTrainingPlanDraft } from "../lib/coach-training-requests.utils";
import { useCoachTrainingRequests } from "../hooks/useCoachTrainingRequests";

export default function CoachTrainingRequestsPage() {
  const {
    coachRequestFilter,
    coachViewMode,
    decisionDescriptions,
    downloadingRequestId,
    downloadTrainingPlan,
    error,
    expandedApprovedRequestId,
    isCoach,
    loading,
    profileLoading,
    saveTrainingPlan,
    savingApprovedRequestId,
    setCoachRequestFilter,
    setCoachViewMode,
    setDecisionDescription,
    toggleApprovedRequestEditor,
    trainingPlanDrafts,
    updateRequestStatus,
    updateTrainingPlanDraft,
    updatingRequestId,
    visibleRequests,
  } = useCoachTrainingRequests();
  const showCoachIncomingRequests = isCoach && coachViewMode === "coach";
  const emptyMessage = showCoachIncomingRequests
    ? {
        pending: "There are currently no pending requests.",
        approved: "There are currently no approved requests.",
        rejected: "There are currently no rejected requests.",
        closed: "There are currently no completed requests.",
      }[coachRequestFilter]
    : "You have not sent any training plan requests yet.";

  return (
    <CaloriexPage>
      <section className="relative container mx-auto px-6 pb-12 md:pb-16">
        {profileLoading || loading ? (
          <div className="mb-6 rounded-[28px] border border-white/60 bg-white/65 p-6 text-sm italic text-slate-600 backdrop-blur">
            Loading requests...
          </div>
        ) : null}

        <div className="space-y-6">
          {error ? (
            <GlassCard className="border-red-300/70 bg-red-50/70">
              <CardContent className="p-4 text-sm text-red-700">{error}</CardContent>
            </GlassCard>
          ) : null}

          <TrainingRequestsHeader
            coachRequestFilter={coachRequestFilter}
            coachViewMode={coachViewMode}
            isCoach={isCoach}
            onFilterChange={setCoachRequestFilter}
            onViewModeChange={setCoachViewMode}
            showCoachIncomingRequests={showCoachIncomingRequests}
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
          ) : (
            <div className="grid gap-6">
              {showCoachIncomingRequests
                ? visibleRequests.map((request) => (
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
                        updateTrainingPlanDraft(request.id, draft)
                      }
                      onDecisionDescriptionChange={(value) =>
                        setDecisionDescription(request.id, value)
                      }
                      onDownloadTrainingPlan={() => void downloadTrainingPlan(request)}
                      onSaveTrainingPlan={() => void saveTrainingPlan(request)}
                      onStatusChange={(status) =>
                        void updateRequestStatus(
                          request.id,
                          status,
                          decisionDescriptions[request.id] ?? ""
                        )
                      }
                      onToggleTrainingPlanEditor={() =>
                        toggleApprovedRequestEditor(request.id)
                      }
                      request={request}
                      savingApprovedRequestId={savingApprovedRequestId}
                      updatingRequestId={updatingRequestId}
                    />
                  ))
                : visibleRequests.map((request) => (
                    <UserRequestCard
                      key={request.id}
                      downloadingRequestId={downloadingRequestId}
                      onDownloadTrainingPlan={() => void downloadTrainingPlan(request)}
                      request={request}
                    />
                  ))}
            </div>
          )}
        </div>
      </section>
    </CaloriexPage>
  );
}
