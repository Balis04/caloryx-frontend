import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
  CaloriexPage,
  GlassCard,
  HeroBadge,
  PageHero,
} from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

import TrainingRequestFormCard from "../components/TrainingRequestFormCard";
import TrainingRequestHeroAside from "../components/TrainingRequestHeroAside";
import TrainingRequestNextStepsCard from "../components/TrainingRequestNextStepsCard";
import TrainingRequestSelectedCoachCard from "../components/TrainingRequestSelectedCoachCard";
import { useCoachDirectory } from "../hooks/useCoachDirectory";
import { useTrainingRequestForm } from "../hooks/useTrainingRequestForm";

const GOAL_OPTIONS = [
  { value: "CUT", label: "Weight loss" },
  { value: "MAINTAIN", label: "Maintenance" },
  { value: "BULK", label: "Muscle gain" },
] as const;

const ACTIVITY_OPTIONS = [
  { value: "SEDENTARY", label: "Very low" },
  { value: "LIGHT", label: "Light activity" },
  { value: "MODERATE", label: "Moderate activity" },
  { value: "ACTIVE", label: "High activity" },
] as const;

export default function TrainingRequestFormPage() {
  const navigate = useNavigate();
  const { coachId } = useParams();
  const { coaches, loading: coachesLoading, error: coachesError } = useCoachDirectory();
  const { formData, loading, submitting, error, setField, submit, canSubmit } =
    useTrainingRequestForm(coachId ?? null);

  const selectedCoach = useMemo(
    () => coaches.find((coach) => coach.id === coachId) ?? null,
    [coachId, coaches]
  );

  const handleSubmit = async () => {
    const success = await submit();

    if (success) {
      navigate("/training-requests");
    }
  };

  if (loading || coachesLoading) {
    return <div className="p-10 italic text-muted-foreground">Loading...</div>;
  }

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
            Back to coach selection
          </Button>
        }
        badge={<HeroBadge>Training request form</HeroBadge>}
        title="Send a clear request so your coach can build the right plan faster."
        description="Fill in your current stats, goal, activity level, and training preferences. The more focused your request is, the easier it is for the coach to respond with something useful."
        chips={["Profile-based fields", "Training preferences", "Coach-linked request"]}
        aside={<TrainingRequestHeroAside coachName={selectedCoach?.fullName} canSubmit={canSubmit} />}
      />

      <section className="relative container mx-auto px-6 py-12 md:py-16">
        {(error || coachesError) && (
          <GlassCard className="mb-6 border-red-300/70 bg-red-50/70">
            <CardContent className="p-4 text-sm text-red-700">{error ?? coachesError}</CardContent>
          </GlassCard>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_360px]">
          <TrainingRequestFormCard
            formData={formData}
            goalLabel={GOAL_OPTIONS.find((option) => option.value === formData.goal)?.label}
            activityLevelLabel={
              ACTIVITY_OPTIONS.find((option) => option.value === formData.activityLevel)?.label
            }
            selectedCoach={Boolean(selectedCoach)}
            canSubmit={canSubmit}
            submitting={submitting}
            onFieldChange={setField}
            onSubmit={() => void handleSubmit()}
          />

          <div className="space-y-6">
            <TrainingRequestSelectedCoachCard selectedCoach={selectedCoach} />
            <TrainingRequestNextStepsCard />
          </div>
        </div>
      </section>
    </CaloriexPage>
  );
}
