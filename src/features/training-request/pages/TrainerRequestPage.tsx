import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, Clock3, Dumbbell, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useTrainerDirectory } from "../hooks/useTrainerDirectory";
import type { TrainerCardData } from "../types/trainer.types";

const TrainerInfo = ({ trainer, selected }: { trainer: TrainerCardData; selected: boolean }) => (
  <div className="flex h-full flex-col gap-4">
    <Card
      className={cn(
        "flex-1 border-border/70 transition-all",
        selected && "border-primary shadow-lg ring-1 ring-primary/20"
      )}
    >
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <CardTitle className="text-xl break-words">{trainer.fullName}</CardTitle>
            <CardDescription className="mt-2 flex items-start gap-2 text-sm break-all">
              <Mail className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{trainer.email}</span>
            </CardDescription>
          </div>
          <Badge variant={selected ? "default" : "secondary"} className="w-fit shrink-0">
            {selected ? "Kivalasztva" : "Elerheto"}
          </Badge>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{trainer.bio}</p>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-3 rounded-xl border bg-muted/20 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Clock3 className="h-4 w-4" />
            <span>Elerheto idopontok</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {trainer.availabilitySlots.map((slot) => (
              <span
                key={slot}
                className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground"
              >
                {slot}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>{trainer.experienceLabel}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {trainer.specialties.map((specialty) => (
            <Badge key={specialty} variant="outline" className="rounded-full px-3 py-1">
              {specialty}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default function TrainerRequestPage() {
  const { trainers, loading, error } = useTrainerDirectory();
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(null);

  const selectedTrainer =
    trainers.find((trainer) => trainer.id === selectedTrainerId) ?? null;

  if (loading) {
    return <div className="p-10 italic text-muted-foreground">Edzok betoltese...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-muted/30">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 lg:py-12">

        {error && (
          <Card className="border-amber-300 bg-amber-50">
            <CardContent className="p-6 text-sm text-amber-900">
              <p>{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_340px]">
          <div className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-3">
            {trainers.map((trainer) => {
              const isSelected = trainer.id === selectedTrainerId;

              return (
                <div key={trainer.id} className="flex h-full flex-col gap-4">
                  <TrainerInfo trainer={trainer} selected={isSelected} />
                  <Button
                    className="mt-auto w-full gap-2"
                    variant={isSelected ? "secondary" : "default"}
                    onClick={() => setSelectedTrainerId(trainer.id)}
                  >
                    {isSelected ? (
                      <>
                        <Check className="h-4 w-4" />
                        Kivalasztottad
                      </>
                    ) : (
                      <>
                        <Dumbbell className="h-4 w-4" />
                        Ezt az edzot valasztom
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
            {!error && trainers.length === 0 && (
              <Card className="sm:col-span-2 2xl:col-span-3">
                <CardContent className="p-6 text-sm text-muted-foreground">
                  Jelenleg nincs elerheto edzoi profil a rendszerben.
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="h-fit border-primary/20 bg-background lg:sticky lg:top-6">
            <CardHeader className="space-y-3">
              <Badge variant="secondary" className="w-fit">
                Kovetkezo lepes
              </Badge>
              <CardTitle>Edzeskero urlap hamarosan</CardTitle>
              <CardDescription className="text-sm leading-6">
                A kovetkezo korben ide kerul majd az urlap, ahol a felhasznalo megadja
                peldaul a szabadidojet, testsulyat es a celjait, majd ezt elkuldjuk a
                kivalasztott edzonek emailben.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              {selectedTrainer ? (
                <>
                  <div className="rounded-lg border bg-muted/40 p-4">
                    <p className="font-medium">Kivalasztott edzo</p>
                    <p className="mt-1 text-muted-foreground">{selectedTrainer.fullName}</p>
                    <p className="text-muted-foreground">{selectedTrainer.email}</p>
                  </div>
                  <p className="text-muted-foreground">
                    A formszakaszban ehhez az edzohoz fogjuk kapcsolni a bekuldott
                    adatokat.
                  </p>
                </>
              ) : (
                <div className="rounded-lg border border-dashed p-4 text-muted-foreground">
                  Valassz ki egy edzot a kartyak kozul, hogy lathato legyen, kihez fog
                  tartozni majd az edzeskero urlap.
                </div>
              )}
            </CardContent>

            <CardFooter>
              <Button disabled className="w-full">
                Urlap megnyitasa hamarosan
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
