import {
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

import { AccentButton, GlassCard } from "@/components/caloriex";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { API_BASE_URL } from "@/lib/api-client";
import { cn } from "@/lib/utils";

import type {
  CoachCardData,
  CoachCertificateData,
} from "@/features/training-requests/types";

const openCertificate = (certificate: CoachCertificateData) => {
  if (!certificate.fileUrl) {
    return;
  }

  const fileUrl = /^https?:\/\//i.test(certificate.fileUrl)
    ? certificate.fileUrl
    : `${API_BASE_URL}${certificate.fileUrl.startsWith("/") ? "" : "/"}${certificate.fileUrl}`;

  window.open(fileUrl, "_blank", "noopener,noreferrer");
};

export default function CoachSelectionCard({
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
            <p>{coach.specialties.find((s) => s.label === "Format")?.value ?? "Format not provided"}</p>
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
            <p className="leading-7 text-slate-600">
              {(coach.contactNote && coach.contactNote !== "-" ? coach.contactNote : coach.bio) || "-"}
            </p>
          </div>
        </div>

        {coach.specialties.slice(1).length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {coach.specialties.slice(1).map((specialty) => (
              <div
                key={`${specialty.label}-${specialty.value}`}
                className="cx-glass-block rounded-[22px] p-4 text-sm text-slate-700"
              >
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <Dumbbell className="h-4 w-4" />
                  {specialty.label}
                </div>
                <p>{specialty.value}</p>
              </div>
            ))}
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

