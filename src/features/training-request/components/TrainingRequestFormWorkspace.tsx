import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  CaloriexPage,
  GlassCard,
  HeroBadge,
  PageHero,
} from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { ACTIVITY_OPTIONS, GOAL_OPTIONS } from "@/shared/constants/user-options";
import { getLabelFromOptions } from "@/shared/utils/optionMapper";

import type { UseCoachDirectoryResult } from "../hooks/useCoachDirectory";
import type { UseTrainingRequestFormResult } from "../hooks/useTrainingRequestForm";
import { TRAINING_REQUEST_FORM_PAGE_COPY } from "../lib/training-request-page.constants";
import TrainingRequestFormSection from "./TrainingRequestFormSection";
import TrainingRequestHeroAside from "./TrainingRequestHeroAside";
import TrainingRequestNextStepsPanel from "./TrainingRequestNextStepsPanel";
import TrainingRequestSelectedCoachCard from "./TrainingRequestSelectedCoachCard";

interface TrainingRequestFormWorkspaceProps {
  coachId: string | null;
  coachDirectory: UseCoachDirectoryResult;
  trainingRequestForm: UseTrainingRequestFormResult;
}

export default function TrainingRequestFormWorkspace({
  coachId,
  coachDirectory,
  trainingRequestForm,
}: TrainingRequestFormWorkspaceProps) {
  const navigate = useNavigate();
  const { coaches, error: coachesError } = coachDirectory;
  const { formData, submitting, error, setField, submit, canSubmit } = trainingRequestForm;

  const selectedCoach = useMemo(
    () => coaches.find((coach) => coach.id === coachId) ?? null,
    [coachId, coaches]
  );
  const goalLabel = formData.goal ? getLabelFromOptions(GOAL_OPTIONS, formData.goal) : undefined;
  const activityLevelLabel = formData.activityLevel
    ? getLabelFromOptions(ACTIVITY_OPTIONS, formData.activityLevel)
    : undefined;

  const handleSubmit = async () => {
    const success = await submit();

    if (success) {
      navigate("/training-requests");
    }
  };

  return (
    <CaloriexPage>
      <PageHero
        leading={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/training-request")}
            className="w-fit rounded-full border border-white/60 bg-white/55 px-4 text-xs text-slate-600 backdrop-blur hover:bg-white/70 hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            {TRAINING_REQUEST_FORM_PAGE_COPY.backButtonLabel}
          </Button>
        }
        badge={<HeroBadge>{TRAINING_REQUEST_FORM_PAGE_COPY.badge}</HeroBadge>}
        title={TRAINING_REQUEST_FORM_PAGE_COPY.title}
        description={TRAINING_REQUEST_FORM_PAGE_COPY.description}
        chips={TRAINING_REQUEST_FORM_PAGE_COPY.chips}
        aside={
          <TrainingRequestHeroAside coachName={selectedCoach?.fullName} canSubmit={canSubmit} />
        }
      />

      <section className="relative container mx-auto px-6 py-12 md:py-16">
        {(error || coachesError) && (
          <GlassCard className="mb-6 border-red-300/70 bg-red-50/70">
            <CardContent className="p-4 text-sm text-red-700">{error ?? coachesError}</CardContent>
          </GlassCard>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_360px]">
          <TrainingRequestFormSection
            formData={formData}
            goalLabel={goalLabel}
            activityLevelLabel={activityLevelLabel}
            selectedCoach={Boolean(selectedCoach)}
            canSubmit={canSubmit}
            submitting={submitting}
            onFieldChange={setField}
            onSubmit={() => void handleSubmit()}
          />

          <div className="space-y-6">
            <TrainingRequestSelectedCoachCard selectedCoach={selectedCoach} />
            <TrainingRequestNextStepsPanel />
          </div>
        </div>
      </section>
    </CaloriexPage>
  );
}
