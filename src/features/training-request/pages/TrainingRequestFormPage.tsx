import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRightLeft,
  Dumbbell,
  Mail,
  Send,
  UserRound,
} from "lucide-react";

import {
  AccentButton,
  CaloriexPage,
  GlassCard,
  GlassCardSoft,
  GlassChip,
  GlassMetric,
  HeroBadge,
} from "@/components/caloriex/design-system";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

const fieldClassName =
  "flex h-11 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-2 text-sm text-slate-900 shadow-sm outline-none backdrop-blur transition focus-visible:ring-2 focus-visible:ring-sky-300/60";

const readOnlyValue = (value: string, fallback: string) => {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : fallback;
};

export default function TrainingRequestFormPage() {
  const navigate = useNavigate();
  const { coachId } = useParams();
  const { coaches, loading: coachesLoading, error: coachesError } = useCoachDirectory();
  const {
    formData,
    loading,
    submitting,
    error,
    setField,
    submit,
    canSubmit,
  } = useTrainingRequestForm(coachId ?? null);

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
      <section className="relative border-b border-white/40">
        <div className="container mx-auto px-6 py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.95fr] lg:items-end">
            <div className="space-y-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/training-request")}
                className="w-fit rounded-full border border-white/60 bg-white/55 px-4 text-xs text-slate-600 backdrop-blur hover:bg-white/70 hover:text-slate-900"
              >
                <ArrowLeft className="mr-2 h-3 w-3" />
                Back to coach selection
              </Button>

              <HeroBadge>Training request form</HeroBadge>
              <div className="space-y-4">
                <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-slate-950 md:text-7xl">
                  Send a clear request so your coach can build the right plan faster.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                  Fill in your current stats, goal, activity level, and training preferences.
                  The more focused your request is, the easier it is for the coach to respond
                  with something useful.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <GlassChip>Profile-based fields</GlassChip>
                <GlassChip>Training preferences</GlassChip>
                <GlassChip>Coach-linked request</GlassChip>
              </div>
            </div>

            <GlassCardSoft className="overflow-hidden">
              <CardContent className="p-0">
                <div className="border-b border-white/50 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                        Request status
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                        Ready to send
                      </h2>
                    </div>
                    <div className="rounded-full border border-cyan-300/40 bg-cyan-100/60 p-3 text-slate-700">
                      <ArrowRightLeft className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-6 sm:grid-cols-2">
                  <GlassMetric
                    label="Coach"
                    value={selectedCoach ? "Linked" : "Missing"}
                    description={
                      selectedCoach
                        ? `${selectedCoach.fullName} is attached to this request.`
                        : "Go back and select a coach first."
                    }
                  />
                  <GlassMetric
                    label="Submit"
                    value={canSubmit ? "Ready" : "Draft"}
                    description="Complete the required fields to enable sending."
                  />
                </div>
              </CardContent>
            </GlassCardSoft>
          </div>
        </div>
      </section>

      <section className="relative container mx-auto px-6 py-12 md:py-16">
        {(error || coachesError) && (
          <GlassCard className="mb-6 border-red-300/70 bg-red-50/70">
            <CardContent className="p-4 text-sm text-red-700">{error ?? coachesError}</CardContent>
          </GlassCard>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_360px]">
          <GlassCardSoft className="overflow-hidden">
            <CardHeader className="border-b border-white/50">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-2xl tracking-tight">Training plan request</CardTitle>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Enter your main preferences and describe what kind of plan you want to
                    receive from the selected coach.
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="w-fit border-sky-400/40 bg-sky-200/55 text-sky-950"
                >
                  New request
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 pt-6">
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <UserRound className="h-5 w-5 text-slate-700" />
                  <h2 className="text-lg font-semibold text-slate-950">Profile-based details</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="cx-glass-block rounded-[24px] p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                      Current weight
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {readOnlyValue(
                        formData.currentWeightKg,
                        "Add your current weight on the profile page"
                      )}
                    </p>
                  </div>

                  <div className="cx-glass-block rounded-[24px] p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                      Target weight
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {readOnlyValue(
                        formData.targetWeightKg,
                        "Add your target weight on the profile page"
                      )}
                    </p>
                  </div>

                  <div className="cx-glass-block rounded-[24px] p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Goal</p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {readOnlyValue(
                        GOAL_OPTIONS.find((option) => option.value === formData.goal)?.label ?? "",
                        "Set your goal on the profile page"
                      )}
                    </p>
                  </div>

                  <div className="cx-glass-block rounded-[24px] p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                      Activity level
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {readOnlyValue(
                        ACTIVITY_OPTIONS.find((option) => option.value === formData.activityLevel)
                          ?.label ?? "",
                        "Set your activity level on the profile page"
                      )}
                    </p>
                  </div>
                </div>

                <div className="cx-glass-block rounded-[24px] p-4 text-sm text-slate-600">
                  These values are shown for reference and come from your profile. If you want
                  to change them, update them on the profile page first.
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-slate-700" />
                  <h2 className="text-lg font-semibold text-slate-950">Training preferences</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="weeklyWorkouts">How many sessions per week do you want?</Label>
                    <Input
                      id="weeklyWorkouts"
                      type="number"
                      min="1"
                      placeholder="e.g. 3"
                      className={fieldClassName}
                      value={formData.weeklyWorkouts}
                      onChange={(event) => setField("weeklyWorkouts", event.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredSessionLength">Session length in minutes</Label>
                    <Input
                      id="preferredSessionLength"
                      type="number"
                      min="15"
                      placeholder="e.g. 60"
                      className={fieldClassName}
                      value={formData.preferredSessionLength}
                      onChange={(event) => setField("preferredSessionLength", event.target.value)}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="trainingLocation">Where would you like to train?</Label>
                    <Input
                      id="trainingLocation"
                      placeholder="e.g. gym, home, outdoors"
                      className={fieldClassName}
                      value={formData.trainingLocation}
                      onChange={(event) => setField("trainingLocation", event.target.value)}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="customerDescription">Short description for the coach</Label>
                    <textarea
                      id="customerDescription"
                      value={formData.customerDescription}
                      onChange={(event) => setField("customerDescription", event.target.value)}
                      placeholder="Describe your goals, experience level, any injuries, or anything else the coach should know."
                      className="min-h-36 w-full rounded-[24px] border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none backdrop-blur transition focus-visible:ring-2 focus-visible:ring-sky-300/60"
                    />
                  </div>
                </div>
              </section>

              <div className="flex justify-end">
                <AccentButton
                  tone="sky"
                  onClick={() => void handleSubmit()}
                  disabled={!canSubmit || !selectedCoach || submitting}
                  className="max-w-xs"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? "Sending..." : "Send to coach"}
                </AccentButton>
              </div>
            </CardContent>
          </GlassCardSoft>

          <div className="space-y-6">
            <GlassCard className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl tracking-tight">Selected coach</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {selectedCoach ? (
                  <>
                    <div className="cx-glass-block rounded-[24px] p-4">
                      <p className="font-medium text-slate-950">{selectedCoach.fullName}</p>
                      <p className="mt-2 flex items-center gap-2 text-slate-600">
                        <Mail className="h-4 w-4" />
                        {selectedCoach.email}
                      </p>
                    </div>
                    <p className="leading-7 text-slate-600">{selectedCoach.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCoach.availabilitySlots.map((slot) => (
                        <Badge
                          key={slot}
                          variant="outline"
                          className="border-white/70 bg-white/60 text-slate-700"
                        >
                          {slot}
                        </Badge>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="rounded-[24px] border border-dashed border-white/70 bg-white/55 p-4 text-slate-600 backdrop-blur">
                    The selected coach could not be found. Go back to the list and choose again.
                  </div>
                )}
              </CardContent>
            </GlassCard>

            <GlassCard className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl tracking-tight">What happens next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <p>
                  The request is sent to the selected coach profile with your weekly session
                  count, session length, preferred location, goal details, and description.
                </p>
                <p>
                  After a successful submission, you will be redirected to the training requests
                  page so you can immediately track the status of your request.
                </p>
              </CardContent>
            </GlassCard>
          </div>
        </div>
      </section>
    </CaloriexPage>
  );
}
