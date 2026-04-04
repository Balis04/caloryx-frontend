import { CaloriexPage, HeroBadge, PageHero } from "@/components/caloriex";

import type { UseCoachTrainingRequestsResult } from "../hooks/useCoachTrainingRequests";
import TrainingRequestsContent from "./TrainingRequestsContent";
import TrainingRequestsHeroAside from "./TrainingRequestsHeroAside";
import TrainingRequestsOverviewPanel from "./TrainingRequestsOverviewPanel";

interface Props {
  trainingRequests: UseCoachTrainingRequestsResult;
}

export default function CoachTrainingRequestsWorkspace({ trainingRequests }: Props) {
  const {
    coachRequestFilter,
    coachViewMode,
    decisionDescriptions,
    downloadingRequestId,
    error,
    expandedApprovedRequestId,
    isCoach,
    savingApprovedRequestId,
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
  } = trainingRequests;

  const showCoachIncomingRequests = isCoach && coachViewMode === "coach";

  return (
    <CaloriexPage>
      <PageHero
        badge={<HeroBadge>Training requests</HeroBadge>}
        title="Manage coaching decisions and plan delivery from one shared workspace."
        description="Incoming coach requests, outgoing user submissions, approval notes, and uploaded plans now live inside the same CalorieX design system."
        chips={[
          showCoachIncomingRequests ? "Coach inbox" : "User history",
          `${visibleRequests.length} visible request${visibleRequests.length === 1 ? "" : "s"}`,
          ...(showCoachIncomingRequests ? [coachRequestFilter] : []),
        ]}
        aside={
          <TrainingRequestsHeroAside
            coachRequestFilter={coachRequestFilter}
            showCoachIncomingRequests={showCoachIncomingRequests}
            visibleCount={visibleRequests.length}
          />
        }
      />

      <section className="relative container mx-auto px-6 py-12 md:py-16">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_340px]">
          <TrainingRequestsContent
            coachRequestFilter={coachRequestFilter}
            coachViewMode={coachViewMode}
            decisionDescriptions={decisionDescriptions}
            downloadingRequestId={downloadingRequestId}
            error={error}
            expandedApprovedRequestId={expandedApprovedRequestId}
            isCoach={isCoach}
            onDecisionDescriptionsChange={setDecisionDescriptions}
            onDownloadTrainingPlan={downloadTrainingPlan}
            onExpandedApprovedRequestIdChange={setExpandedApprovedRequestId}
            onFilterChange={setCoachRequestFilter}
            onSaveTrainingPlan={saveTrainingPlan}
            onTrainingPlanDraftsChange={setTrainingPlanDrafts}
            onUpdateRequestStatus={updateRequestStatus}
            onViewModeChange={setCoachViewMode}
            savingApprovedRequestId={savingApprovedRequestId}
            showCoachIncomingRequests={showCoachIncomingRequests}
            trainingPlanDrafts={trainingPlanDrafts}
            updatingRequestId={updatingRequestId}
            visibleRequests={visibleRequests}
          />

          <TrainingRequestsOverviewPanel showCoachIncomingRequests={showCoachIncomingRequests} />
        </div>
      </section>
    </CaloriexPage>
  );
}
