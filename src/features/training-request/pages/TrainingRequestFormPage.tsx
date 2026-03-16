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
  { value: "CUT", label: "Fogyás" },
  { value: "MAINTAIN", label: "Szinten tartás" },
  { value: "BULK", label: "Tömegnövelés" },
] as const;

const ACTIVITY_OPTIONS = [
  { value: "SEDENTARY", label: "Nagyon alacsony" },
  { value: "LIGHT", label: "Könnyű aktivitás" },
  { value: "MODERATE", label: "Közepes aktivitás" },
  { value: "ACTIVE", label: "Magas aktivitás" },
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
    return <div className="p-10 italic text-muted-foreground">Betöltés...</div>;
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
          Vissza az edzőválasztóhoz
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
          <Card className="shadow-lg border-t-4 border-t-primary">
            <CardHeader className="border-b">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-2xl">Edzésterv kérés</CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Add meg a főbb paramétereidet és írd le röviden, milyen
                    edzéstervre lenne szükséged.
                  </p>
                </div>
                <Badge variant="secondary" className="w-fit">
                  Új kérés
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 pt-6">
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <UserRound className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Alapadatok a profilból</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currentWeightKg">Jelenlegi testsúly</Label>
                    <Input
                      id="currentWeightKg"
                      value={formData.currentWeightKg}
                      onChange={(event) =>
                        setField("currentWeightKg", event.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetWeightKg">Cél testsúly</Label>
                    <Input
                      id="targetWeightKg"
                      value={formData.targetWeightKg}
                      onChange={(event) =>
                        setField("targetWeightKg", event.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goal">Cél</Label>
                    <select
                      id="goal"
                      value={formData.goal}
                      onChange={(event) =>
                        setField("goal", event.target.value as Goal | "")
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="">Válassz célt</option>
                      {GOAL_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activityLevel">Aktivitási szint</Label>
                    <select
                      id="activityLevel"
                      value={formData.activityLevel}
                      onChange={(event) =>
                        setField(
                          "activityLevel",
                          event.target.value as ActivityLevel | ""
                        )
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="">Válassz aktivitási szintet</option>
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
                    Ezeket az adatokat később a backend a felhasználói profilból is
                    tudja majd tölteni.
                  </div>
                )}
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Edzési igények</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="weeklyWorkouts">Heti hány edzést szeretnél?</Label>
                    <Input
                      id="weeklyWorkouts"
                      type="number"
                      min="1"
                      placeholder="Például: 3"
                      value={formData.weeklyWorkouts}
                      onChange={(event) =>
                        setField("weeklyWorkouts", event.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredSessionLength">
                      Egy alkalom hossza percben
                    </Label>
                    <Input
                      id="preferredSessionLength"
                      type="number"
                      min="15"
                      placeholder="Például: 60"
                      value={formData.preferredSessionLength}
                      onChange={(event) =>
                        setField("preferredSessionLength", event.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="trainingLocation">Hol szeretnél edzeni?</Label>
                    <Input
                      id="trainingLocation"
                      placeholder="Például: konditeremben, otthon, szabadtéren"
                      value={formData.trainingLocation}
                      onChange={(event) =>
                        setField("trainingLocation", event.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="customerDescription">
                      Rövid leírás az edző számára
                    </Label>
                    <textarea
                      id="customerDescription"
                      value={formData.customerDescription}
                      onChange={(event) =>
                        setField("customerDescription", event.target.value)
                      }
                      placeholder="Írd le, milyen céljaid vannak, milyen tapasztalattal rendelkezel, van-e sérülésed vagy bármi fontos körülmény."
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
                  {submitting ? "Küldés..." : "Küldés az edzőnek"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Kiválasztott edző</CardTitle>
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
                    Nem található a kiválasztott edző. Menj vissza a listához és
                    válassz újra.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Mi fog történni?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  A backend ezt az űrlapot a kiválasztott edző coach profile
                  azonosítójához küldi el, és onnan tudja majd az e-mail küldést
                  kezelni.
                </p>
                <p>
                  A kéréshez most a heti edzésszám, az alkalom hossza, a preferált
                  helyszín és a leírás kerül beküldésre.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
