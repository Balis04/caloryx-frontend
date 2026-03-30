import {
  ArrowRight,
  Check,
  Clock3,
  Download,
  Dumbbell,
  FileBadge2,
  Info,
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { API_BASE_URL } from "@/lib/api-client";
import { cn } from "@/lib/utils";

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

function CoachSelectionCard({
  coach,
  selected,
  onSelect,
}: {
  coach: CoachCardData;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <GlassCard
      className={cn(
        "overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_-30px_rgba(15,23,42,0.35)]",
        selected && "ring-2 ring-emerald-300/60"
      )}
    >
      <div className="bg-gradient-to-br from-emerald-300/20 via-cyan-300/10 to-slate-950/0 p-5">
        <div className="rounded-[28px] border border-emerald-300/40 bg-white/60 p-5 shadow-sm backdrop-blur-xl">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.32em] text-slate-500">
                Coach profile
              </p>
              <h2 className="mt-3 break-words text-2xl font-semibold tracking-tight text-slate-950">
                {coach.fullName}
              </h2>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "w-fit border backdrop-blur",
                selected
                  ? "border-emerald-400/40 bg-emerald-200/50 text-emerald-950"
                  : "border-slate-300/40 bg-white/70 text-slate-700"
              )}
            >
              {selected ? "Selected" : "Available"}
            </Badge>
          </div>

          <div className="rounded-[24px] border border-white/60 bg-white/60 p-5">
            <div className="flex items-start gap-3 text-sm text-slate-600">
              <Mail className="mt-1 h-4 w-4 shrink-0 text-slate-500" />
              <span className="break-all">{coach.email}</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">{coach.bio}</p>
          </div>
        </div>
      </div>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="cx-glass-block rounded-[22px] p-4 text-sm text-slate-700">
            <div className="mb-2 flex items-center gap-2 text-slate-500">
              <ShieldCheck className="h-4 w-4" />
              Experience
            </div>
            <p>{coach.experienceLabel}</p>
          </div>

          <div className="cx-glass-block rounded-[22px] p-4 text-sm text-slate-700">
            <div className="mb-2 flex items-center gap-2 text-slate-500">
              <Users className="h-4 w-4" />
              Format
            </div>
            <p>{coach.specialties[0] ?? "Format not provided"}</p>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="cx-glass-block rounded-[22px] p-4 text-sm text-slate-700">
            <div className="mb-2 flex items-center gap-2 text-slate-500">
              <Clock3 className="h-4 w-4" />
              Available time slots
            </div>
            <div className="flex flex-wrap gap-2">
              {coach.availabilitySlots.map((slot) => (
                <span
                  key={slot}
                  className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs text-slate-600"
                >
                  {slot}
                </span>
              ))}
            </div>
          </div>

          <div className="cx-glass-block rounded-[22px] p-4 text-sm text-slate-700">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-900">
              <Info className="h-4 w-4 text-slate-500" />
              About coach
            </div>
            <p className="leading-7 text-slate-600">{coach.contactNote || coach.bio || "-"}</p>
          </div>
        </div>

        {coach.specialties.slice(1).length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {coach.specialties.slice(1).map((specialty) => {
              const [label, ...rest] = specialty.split(":");
              const value = rest.join(":").trim() || specialty;

              return (
                <div
                  key={specialty}
                  className="cx-glass-block rounded-[22px] p-4 text-sm text-slate-700"
                >
                  <div className="mb-2 flex items-center gap-2 text-slate-500">
                    <Dumbbell className="h-4 w-4" />
                    {label.trim()}
                  </div>
                  <p>{value}</p>
                </div>
              );
            })}
          </div>
        ) : null}

        <div className="cx-glass-block rounded-[22px] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-900">
            <FileBadge2 className="h-4 w-4 text-slate-500" />
            Certificates
          </div>
          {coach.certificates && coach.certificates.length > 0 ? (
            <div className="grid gap-2">
              {coach.certificates.map((certificate) => (
                <button
                  key={certificate.id}
                  type="button"
                  onClick={() => openCertificate(certificate)}
                  className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-white"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">
                      {certificate.certificateName}
                    </p>
                    {certificate.issuer ? (
                      <p className="truncate text-xs text-slate-500">{certificate.issuer}</p>
                    ) : null}
                  </div>
                  <Download className="ml-3 h-4 w-4 shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">No certificates available.</p>
          )}
        </div>

        <AccentButton tone={selected ? "emerald" : "slate"} onClick={onSelect}>
          {selected ? (
            <>
              <Check className="h-4 w-4" />
              Selected coach
            </>
          ) : (
            <>
              <Dumbbell className="h-4 w-4" />
              Choose this coach
            </>
          )}
        </AccentButton>
      </CardContent>
    </GlassCard>
  );
}

export default function CoachRequestPage() {
  const navigate = useNavigate();
  const { coaches, loading, error } = useCoachDirectory();
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);

  const selectedCoach = coaches.find((coach) => coach.id === selectedCoachId) ?? null;

  if (loading) {
    return <div className="p-10 italic text-muted-foreground">Loading coaches...</div>;
  }

  return (
    <CaloriexPage>
      <section className="relative border-b border-white/40">
        <div className="container mx-auto px-6 py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.95fr] lg:items-end">
            <div className="space-y-6">
              <HeroBadge>Training request</HeroBadge>
              <div className="space-y-4">
                <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-slate-950 md:text-7xl">
                  Choose a coach first, then send a focused training request.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                  Browse available coaches, review their background, then open a dedicated
                  request form with your preferences and goals already centered around the
                  selected coach.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <GlassChip>Coach selection</GlassChip>
                <GlassChip>Goal-based request</GlassChip>
                <GlassChip>Certificates and availability</GlassChip>
              </div>
            </div>

            <GlassCardSoft className="overflow-hidden">
              <CardContent className="p-0">
                <div className="border-b border-white/50 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                        Request flow
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                        Start a custom plan
                      </h2>
                    </div>
                    <div className="rounded-full border border-cyan-300/40 bg-cyan-100/60 p-3 text-slate-700">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-6 sm:grid-cols-2">
                  <GlassMetric
                    label="Coaches"
                    value={String(coaches.length).padStart(2, "0")}
                    description="Available profiles you can request a plan from."
                  />
                  <GlassMetric
                    label="Next step"
                    value={selectedCoach ? "Ready" : "Choose"}
                    description={
                      selectedCoach
                        ? `Selected coach: ${selectedCoach.fullName}`
                        : "Select a coach card to continue to the request form."
                    }
                  />
                </div>
              </CardContent>
            </GlassCardSoft>
          </div>
        </div>
      </section>

      <section className="relative container mx-auto px-6 py-12 md:py-16">
        {error ? (
          <GlassCard className="border-amber-300/70 bg-amber-50/70">
            <CardContent className="p-6 text-sm text-amber-900">{error}</CardContent>
          </GlassCard>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_360px]">
          <div className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-3">
            {coaches.map((coach) => (
              <CoachSelectionCard
                key={coach.id}
                coach={coach}
                selected={coach.id === selectedCoachId}
                onSelect={() => setSelectedCoachId(coach.id)}
              />
            ))}

            {!error && coaches.length === 0 ? (
              <GlassCard className="sm:col-span-2 2xl:col-span-3">
                <CardContent className="p-6 text-sm text-slate-600">
                  No coach profiles are currently available.
                </CardContent>
              </GlassCard>
            ) : null}
          </div>

          <GlassCardSoft className="h-fit overflow-hidden lg:sticky lg:top-6">
            <CardHeader className="space-y-3 border-b border-white/50">
              <Badge
                variant="outline"
                className="w-fit border-sky-400/40 bg-sky-200/55 text-sky-950"
              >
                Next step
              </Badge>
              <CardTitle className="text-2xl tracking-tight">Open the request form</CardTitle>
              <CardDescription className="text-sm leading-7 text-slate-600">
                Continue with the selected coach and fill in the details of the training plan
                you want to receive.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 p-6">
              {selectedCoach ? (
                <>
                  <div className="cx-glass-block rounded-[24px] p-4 text-sm text-slate-700">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                      Selected coach
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {selectedCoach.fullName}
                    </p>
                    <p className="mt-1 text-slate-600">{selectedCoach.email}</p>
                  </div>
                  <div className="cx-glass-block rounded-[24px] p-4 text-sm text-slate-600">
                    On the next page, your request will be linked to this coach profile so you
                    can send your details, preferences, and short description in one step.
                  </div>
                </>
              ) : (
                <div className="rounded-[24px] border border-dashed border-white/70 bg-white/55 p-4 text-sm text-slate-600 backdrop-blur">
                  Select a coach card first to unlock the training request form.
                </div>
              )}

              <AccentButton
                tone="sky"
                disabled={!selectedCoach}
                onClick={() => navigate(`/training-request/${selectedCoachId}`)}
              >
                <ArrowRight className="h-4 w-4" />
                Open training request form
              </AccentButton>
            </CardContent>
          </GlassCardSoft>
        </div>
      </section>
    </CaloriexPage>
  );
}
