import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  CaloriexPage,
  GlassCard,
} from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";
import { ACTIVITY_OPTIONS, GOAL_OPTIONS } from "@/shared/constants/user-options";
import { getLabelFromOptions } from "@/shared/utils/optionMapper";

import CoachRequestNextStepPanel from "../components/CoachRequestNextStepPanel";
import TrainingRequestFormSection from "../components/TrainingRequestFormSection";
import { getCoachDirectory } from "../api/coach-directory.api";
import { mapCoachDirectoryResponsesToCards } from "../lib/coach-directory.mapper";
import type { CoachCardData } from "@/features/training-requests/types";
import { useTrainingRequestForm } from "../hooks/useTrainingRequestForm";
import { useEffect, useState } from "react";

export default function TrainingRequestFormPage() {
  const navigate = useNavigate();
  const { coachId } = useParams();
  const trainingRequestForm = useTrainingRequestForm(coachId ?? null);
  const [coaches, setCoaches] = useState<CoachCardData[]>([]);
  const [coachesLoading, setCoachesLoading] = useState(true);
  const [coachesError, setCoachesError] = useState<string | null>(null);

  useEffect(() => {
    const loadCoaches = async () => {
      setCoachesLoading(true);
      setCoachesError(null);

      try {
        const response = await getCoachDirectory();
        setCoaches(mapCoachDirectoryResponsesToCards(response));
      } catch {
        setCoaches([]);
        setCoachesError("Failed to load the coach list from the backend.");
      } finally {
        setCoachesLoading(false);
      }
    };

    void loadCoaches();
  }, []);

  const selectedCoach = useMemo(
    () => coaches.find((coach) => coach.id === (coachId ?? null)) ?? null,
    [coachId, coaches]
  );
  const goalLabel = trainingRequestForm.formData.goal
    ? getLabelFromOptions(GOAL_OPTIONS, trainingRequestForm.formData.goal)
    : undefined;
  const activityLevelLabel = trainingRequestForm.formData.activityLevel
    ? getLabelFromOptions(ACTIVITY_OPTIONS, trainingRequestForm.formData.activityLevel)
    : undefined;

  const handleSubmit = async () => {
    const success = await trainingRequestForm.submit();
    if (success) {
      navigate("/training-requests");
    }
  };

  return (
    <CaloriexPage>
      <section className="relative container mx-auto px-6 pb-12 md:pb-16">
        {trainingRequestForm.loading || coachesLoading ? (
          <GlassCard className="mb-6">
            <CardContent className="p-4 text-sm italic text-slate-600">Loading...</CardContent>
          </GlassCard>
        ) : null}

        {(trainingRequestForm.error || coachesError) && (
          <GlassCard className="mb-6 border-red-300/70 bg-red-50/70">
            <CardContent className="p-4 text-sm text-red-700">
              {trainingRequestForm.error ?? coachesError}
            </CardContent>
          </GlassCard>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_360px]">
          <TrainingRequestFormSection
            formData={trainingRequestForm.formData}
            goalLabel={goalLabel}
            activityLevelLabel={activityLevelLabel}
            onFieldChange={trainingRequestForm.setField}
          />

          <CoachRequestNextStepPanel
            selectedCoach={selectedCoach}
            title="Send the request"
            description="Review the selected coach, then send your request with your preferences and short description."
            actionLabel="Send to coach"
            disabled={!trainingRequestForm.canSubmit}
            loading={trainingRequestForm.submitting || trainingRequestForm.loading || coachesLoading}
            onAction={() => void handleSubmit()}
          />
        </div>
      </section>
    </CaloriexPage>
  );
}

