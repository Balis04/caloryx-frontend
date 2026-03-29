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
import { API_BASE_URL } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { Check, Clock3, Download, Dumbbell, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCoachDirectory } from "../hooks/useCoachDirectory";
import type { CoachCardData, CoachCertificateData } from "../types/coach.types";

const openCertificate = (certificate: CoachCertificateData) => {
  if (!certificate.fileUrl) {
    return;
  }

  const fileUrl = /^https?:\/\//i.test(certificate.fileUrl)
    ? certificate.fileUrl
    : `${API_BASE_URL}${certificate.fileUrl.startsWith("/") ? "" : "/"}${certificate.fileUrl}`;

  window.open(fileUrl, "_blank", "noopener,noreferrer");
};

const CoachInfo = ({ coach, selected }: { coach: CoachCardData; selected: boolean }) => (
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
            <CardTitle className="break-words text-xl">{coach.fullName}</CardTitle>
            <CardDescription className="mt-2 flex items-start gap-2 break-all text-sm">
              <Mail className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{coach.email}</span>
            </CardDescription>
          </div>
          <Badge variant={selected ? "default" : "secondary"} className="w-fit shrink-0">
            {selected ? "Selected" : "Available"}
          </Badge>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{coach.bio}</p>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-3 rounded-xl border bg-muted/20 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Clock3 className="h-4 w-4" />
            <span>Available time slots</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {coach.availabilitySlots.map((slot) => (
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
          <span>{coach.experienceLabel}</span>
        </div>

        <div className="space-y-2 rounded-xl border bg-muted/20 p-4">
          <div className="text-sm font-medium">Contact note</div>
          <p className="text-sm text-muted-foreground">{coach.contactNote || "-"}</p>
        </div>

        <div className="space-y-3 rounded-xl border bg-muted/20 p-4">
          <div className="text-sm font-medium">Certificates</div>
          {coach.certificates && coach.certificates.length > 0 ? (
            <div className="grid gap-2">
              {coach.certificates.map((certificate) => (
                <button
                  key={certificate.id}
                  type="button"
                  onClick={() => openCertificate(certificate)}
                  className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50"
                >
                  <span className="truncate">{certificate.certificateName}</span>
                  <Download className="h-4 w-4 shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No certificates available.</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {coach.specialties.map((specialty) => (
            <Badge key={specialty} variant="outline" className="rounded-full px-3 py-1">
              {specialty}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default function CoachRequestPage() {
  const navigate = useNavigate();
  const { coaches, loading, error } = useCoachDirectory();
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);

  const selectedCoach =
    coaches.find((coach) => coach.id === selectedCoachId) ?? null;

  if (loading) {
    return <div className="p-10 italic text-muted-foreground">Loading coaches...</div>;
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
            {coaches.map((coach) => {
              const isSelected = coach.id === selectedCoachId;

              return (
                <div key={coach.id} className="flex h-full flex-col gap-4">
                  <CoachInfo coach={coach} selected={isSelected} />
                  <Button
                    className="mt-auto w-full gap-2"
                    variant={isSelected ? "secondary" : "default"}
                    onClick={() => setSelectedCoachId(coach.id)}
                  >
                    {isSelected ? (
                      <>
                        <Check className="h-4 w-4" />
                        Selected
                      </>
                    ) : (
                      <>
                        <Dumbbell className="h-4 w-4" />
                        Choose this coach
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
            {!error && coaches.length === 0 && (
              <Card className="sm:col-span-2 2xl:col-span-3">
                <CardContent className="p-6 text-sm text-muted-foreground">
                  No coach profiles are currently available.
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="h-fit border-primary/20 bg-background lg:sticky lg:top-6">
            <CardHeader className="space-y-3">
              <Badge variant="secondary" className="w-fit">
                Next step
              </Badge>
              <CardTitle>Training plan request</CardTitle>
              <CardDescription className="text-sm leading-6">
                Open a dedicated request page for the selected coach, where you can
                provide your main details, goals, and a short description.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              {selectedCoach ? (
                <>
                  <div className="rounded-lg border bg-muted/40 p-4">
                    <p className="font-medium">Selected coach</p>
                    <p className="mt-1 text-muted-foreground">{selectedCoach.fullName}</p>
                    <p className="text-muted-foreground">{selectedCoach.email}</p>
                  </div>
                  <p className="text-muted-foreground">
                    On the next page, your training plan request will be linked to this coach.
                  </p>
                </>
              ) : (
                <div className="rounded-lg border border-dashed p-4 text-muted-foreground">
                  Select a coach from the cards to open the training request form.
                </div>
              )}
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                disabled={!selectedCoach}
                onClick={() => navigate(`/training-request/${selectedCoachId}`)}
              >
                Open training request form
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
