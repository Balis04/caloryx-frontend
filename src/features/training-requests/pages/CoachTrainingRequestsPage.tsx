import { CaloriexPage, GlassCard } from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";
import CoachRequestCard from "../components/CoachRequestCard";
import TrainingRequestsHeader from "../components/TrainingRequestsHeader";
import UserRequestCard from "../components/UserRequestCard";
import { useCoachTrainingRequestsPage } from "../hooks/useCoachTrainingRequestsPage";

export default function CoachTrainingRequestsPage() {
  const {
    coachRequestFilter,
    coachViewMode,
    decisionDescriptions,
    downloadingRequestId,
    downloadTrainingPlan,
    emptyMessage,
    expandedApprovedRequestId,
    getTrainingPlanDraft,
    isCoach,
    loading,
    profileLoading,
    saveTrainingPlan,
    savingApprovedRequestId,
    setCoachRequestFilter,
    setCoachViewMode,
    setDecisionDescription,
    showCoachIncomingRequests,
    toggleApprovedRequestEditor,
    updateRequestStatus,
    updateTrainingPlanDraft,
    updatingRequestId,
    visibleRequests,
  } = useCoachTrainingRequestsPage();

  return (
    <CaloriexPage>
      <section className="relative container mx-auto px-6 pb-12 md:pb-16">
        {profileLoading || loading ? (
          <div className="mb-6 rounded-[28px] border border-white/60 bg-white/65 p-6 text-sm italic text-slate-600 backdrop-blur">
            Loading requests...
          </div>
        ) : null}

        <div className="space-y-6">
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
                      approvedDraft={getTrainingPlanDraft(request)}
                      decisionDescription={
                        decisionDescriptions[request.id] ?? request.coachResponse ?? ""
                      }
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

