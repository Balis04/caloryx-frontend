import {
  CaloriexPage,
  GlassCard,
} from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";

import CoachRequestNextStepPanel from "../components/CoachRequestNextStepPanel";
import CoachSelectionCard from "../components/CoachSelectionCard";
import { useCoachRequestPage } from "../hooks/useCoachRequestPage";

export default function CoachRequestPage() {
  const {
    canContinue,
    coaches,
    selectedCoach,
    loading,
    selectCoach,
    openTrainingRequestForm,
  } = useCoachRequestPage();

  return (
    <CaloriexPage>
      <section className="relative container mx-auto px-6 pb-12 md:pb-16">
        {loading ? (
          <GlassCard className="mb-6">
            <CardContent className="p-6 text-sm italic text-slate-600">
              Loading coaches...
            </CardContent>
          </GlassCard>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_360px]">
          <div className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-3">
            {coaches.map((coach) => (
              <CoachSelectionCard
                key={coach.id}
                coach={coach}
                selected={coach.id === selectedCoach?.id}
                onSelect={() => selectCoach(coach.id)}
              />
            ))}

            {!loading && coaches.length === 0 ? (
              <GlassCard className="sm:col-span-2 2xl:col-span-3">
                <CardContent className="p-6 text-sm text-slate-600">
                  No coach profiles are currently available.
                </CardContent>
              </GlassCard>
            ) : null}
          </div>

          <CoachRequestNextStepPanel
            selectedCoach={selectedCoach}
            disabled={!canContinue}
            onAction={openTrainingRequestForm}
          />
        </div>
      </section>
    </CaloriexPage>
  );
}
