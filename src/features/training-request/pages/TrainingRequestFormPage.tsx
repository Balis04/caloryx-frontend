import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActivityLevel, Goal } from "@/shared/types/profile.types";
import { ArrowLeft, Dumbbell, Mail, Send, UserRound } from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTrainerDirectory } from "../hooks/useTrainerDirectory";
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
  const { trainerId } = useParams();
  const { trainers, loading: trainersLoading, error: trainersError } =
    useTrainerDirectory();
  const {
    profile,
    formData,
    loading,
    submitting,
    error,
    submitMessage,
    setField,
    submit,
    canSubmit,
  } = useTrainingRequestForm(trainerId ?? null);

  const selectedTrainer = useMemo(
    () => trainers.find((trainer) => trainer.id === trainerId) ?? null,
    [trainerId, trainers]
  );

  if (loading || trainersLoading) {
    return <div className="p-10 italic text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-muted/30 px-4 py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/training-request")}
          className="w-fit text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-3 w-3" />
          Back to trainer selection
        </Button>

        {(error || trainersError) && (
          <Card className="border-red-300 bg-red-50">
            <CardContent className="p-4 text-sm text-red-700">
              {error ?? trainersError}
            </CardContent>
          </Card>
        )}

        {submitMessage && (
          <Card className="border-emerald-300 bg-emerald-50">
            <CardContent className="p-4 text-sm text-emerald-800">
              {submitMessage}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_360px]">
          <Card className="border-t-4 border-t-primary shadow-lg">
            <CardHeader className="border-b">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-2xl">Training plan request</CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Enter your main preferences and briefly describe what kind of
                    training plan you need.
                  </p>
                </div>
                <Badge variant="secondary" className="w-fit">
                  New request
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 pt-6">
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <UserRound className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Profile-based details</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currentWeightKg">Current weight</Label>
                    <Input
                      id="currentWeightKg"
                      value={formData.currentWeightKg}
                      onChange={(event) =>
                        setField("currentWeightKg", event.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetWeightKg">Target weight</Label>
                    <Input
                      id="targetWeightKg"
                      value={formData.targetWeightKg}
                      onChange={(event) =>
                        setField("targetWeightKg", event.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goal">Goal</Label>
                    <select
                      id="goal"
                      value={formData.goal}
                      onChange={(event) =>
                        setField("goal", event.target.value as Goal | "")
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="">Select a goal</option>
                      {GOAL_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activityLevel">Activity level</Label>
                    <select
                      id="activityLevel"
                      value={formData.activityLevel}
                      onChange={(event) =>
                        setField("activityLevel", event.target.value as ActivityLevel | "")
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="">Select an activity level</option>
                      {ACTIVITY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {profile && (
                  <div className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground">
                    Later, the backend can also load these details from the user profile.
                  </div>
                )}
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Training preferences</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="weeklyWorkouts">How many sessions per week do you want?</Label>
                    <Input
                      id="weeklyWorkouts"
                      type="number"
                      min="1"
                      placeholder="e.g. 3"
                      value={formData.weeklyWorkouts}
                      onChange={(event) =>
                        setField("weeklyWorkouts", event.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredSessionLength">Session length in minutes</Label>
                    <Input
                      id="preferredSessionLength"
                      type="number"
                      min="15"
                      placeholder="e.g. 60"
                      value={formData.preferredSessionLength}
                      onChange={(event) =>
                        setField("preferredSessionLength", event.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="trainingLocation">Where would you like to train?</Label>
                    <Input
                      id="trainingLocation"
                      placeholder="e.g. gym, home, outdoors"
                      value={formData.trainingLocation}
                      onChange={(event) =>
                        setField("trainingLocation", event.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="customerDescription">Short description for the trainer</Label>
                    <textarea
                      id="customerDescription"
                      value={formData.customerDescription}
                      onChange={(event) =>
                        setField("customerDescription", event.target.value)
                      }
                      placeholder="Describe your goals, experience level, any injuries, or anything else the trainer should know."
                      className="min-h-36 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                </div>
              </section>

              <div className="flex justify-end">
                <Button
                  onClick={() => void submit()}
                  disabled={!canSubmit || !selectedTrainer || submitting}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? "Sending..." : "Send to trainer"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Selected trainer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {selectedTrainer ? (
                  <>
                    <div className="rounded-xl border bg-muted/20 p-4">
                      <p className="font-medium">{selectedTrainer.fullName}</p>
                      <p className="mt-1 flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {selectedTrainer.email}
                      </p>
                    </div>
                    <p className="text-muted-foreground">{selectedTrainer.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTrainer.availabilitySlots.map((slot) => (
                        <Badge key={slot} variant="outline">
                          {slot}
                        </Badge>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="rounded-xl border border-dashed p-4 text-muted-foreground">
                    The selected trainer could not be found. Go back to the list and choose again.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>What happens next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  The backend sends this form to the selected trainer&apos;s coach profile ID
                  and can then handle the related notification flow.
                </p>
                <p>
                  The request currently submits the weekly session count, session length,
                  preferred location, and your description.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
