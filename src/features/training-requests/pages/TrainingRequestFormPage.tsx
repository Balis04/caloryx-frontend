import { CaloriexPage, GlassCard } from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";

import CoachRequestNextStepPanel from "../components/CoachRequestNextStepPanel";
import TrainingRequestFormSection from "../components/TrainingRequestFormSection";
import { useTrainingRequestFormPage } from "../hooks/useTrainingRequestFormPage";

export default function TrainingRequestFormPage() {
  const trainingRequestFormPage = useTrainingRequestFormPage();

  return (
    <CaloriexPage>
      <section className="relative container mx-auto px-6 pb-12 md:pb-16">
        {trainingRequestFormPage.loading || trainingRequestFormPage.coachesLoading ? (
          <GlassCard className="mb-6">
            <CardContent className="p-4 text-sm italic text-slate-600">Loading...</CardContent>
          </GlassCard>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_360px]">
          <TrainingRequestFormSection
            formData={trainingRequestFormPage.formData}
            goalLabel={trainingRequestFormPage.goalLabel}
            activityLevelLabel={trainingRequestFormPage.activityLevelLabel}
            onFieldChange={trainingRequestFormPage.setField}
          />

          <CoachRequestNextStepPanel
            selectedCoach={trainingRequestFormPage.selectedCoach}
            title="Send the request"
            description="Review the selected coach, then send your request with your preferences and short description."
            actionLabel="Send to coach"
            disabled={!trainingRequestFormPage.canSubmit}
            loading={
              trainingRequestFormPage.submitting ||
              trainingRequestFormPage.loading ||
              trainingRequestFormPage.coachesLoading
            }
            onAction={() => void trainingRequestFormPage.submit()}
          />
        </div>
      </section>
    </CaloriexPage>
  );
}

