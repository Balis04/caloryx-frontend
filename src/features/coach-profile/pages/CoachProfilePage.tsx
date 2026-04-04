import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  AccentButton,
  CaloriexPage,
  HeroBadge,
  NoticeCard,
  PageHero,
} from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

import CoachProfileHeroAside from "../components/CoachProfileHeroAside";
import CoachProfileOverviewCard from "../components/CoachProfileOverviewCard";
import {
  CoachProfileCertificatesPanel,
  CoachProfileOfferPanel,
  CoachProfilePublicInfoPanel,
} from "../components/CoachProfileReadonlyPanels";
import { useCoachProfileForm } from "../hooks/useCoachProfileForm";
import { openCoachCertificate } from "../lib/coach-profile.certificates";
import { formatPriceRange, getTrainingFormatLabel } from "../lib/coach-profile.presentation";
import { GlassCard } from "@/components/caloriex";

export default function CoachProfilePage() {
  const navigate = useNavigate();
  const { formData, loading, errorMessage, isForbidden, hasCoachProfile, statusMessage } =
    useCoachProfileForm();

  const downloadableCertificates = useMemo(
    () => formData.certificates.filter((certificate) => certificate.fileUrl),
    [formData.certificates]
  );

  const activeAvailability = useMemo(
    () =>
      formData.availability
        .filter((slot) => slot.enabled)
        .map((slot) => `${slot.label} ${slot.from}-${slot.until}`),
    [formData.availability]
  );

  const trainingFormatLabel = getTrainingFormatLabel(formData.sessionFormat);
  const priceRange = formatPriceRange(
    formData.priceFrom,
    formData.priceTo,
    formData.currency
  );

  if (loading) {
    return (
      <CaloriexPage>
        <section className="container mx-auto px-6 py-16">
          <NoticeCard>Loading coach profile workspace...</NoticeCard>
        </section>
      </CaloriexPage>
    );
  }

  if (isForbidden) {
    return (
      <CaloriexPage>
        <section className="container mx-auto px-6 py-16">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="mb-4 w-fit rounded-full border border-white/60 bg-white/55 px-4 text-xs text-slate-600 backdrop-blur hover:bg-white/70 hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            Back to profile
          </Button>
          <NoticeCard tone="danger">{errorMessage ?? "Forbidden"}</NoticeCard>
        </section>
      </CaloriexPage>
    );
  }

  if (!hasCoachProfile) {
    return (
      <CaloriexPage>
        <PageHero
          leading={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/profile")}
              className="w-fit rounded-full border border-white/60 bg-white/55 px-4 text-xs text-slate-600 backdrop-blur hover:bg-white/70 hover:text-slate-900"
            >
              <ArrowLeft className="mr-2 h-3 w-3" />
              Back to profile
            </Button>
          }
          badge={<HeroBadge>Coach profile</HeroBadge>}
          title="Create the public coaching profile users will see before they reach out."
          description="Set up your positioning, schedule, pricing, and certificate proof in a dedicated editing workspace."
          chips={["No profile yet", "Coach-only workspace", "Public-facing setup"]}
          aside={
            <CoachProfileHeroAside
              maxCapacity={formData.maxCapacity}
              trainingFormatLabel={trainingFormatLabel}
              certificateCount={downloadableCertificates.length}
            />
          }
        />

        <section className="container mx-auto px-6 py-12 md:py-16">
          {errorMessage ? <NoticeCard tone="danger" className="mb-6">{errorMessage}</NoticeCard> : null}
          {statusMessage ? <NoticeCard tone="success" className="mb-6">{statusMessage}</NoticeCard> : null}

          <GlassCard className="overflow-hidden">
            <CardContent className="space-y-4 p-6 md:p-8">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-cyan-300/50 bg-cyan-100/70 p-3 text-slate-700">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    Next step
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                    Open the coach profile editor
                  </h2>
                </div>
              </div>

              <p className="max-w-2xl text-sm leading-7 text-slate-600">
                Your public coach page does not exist yet. Create it in the dedicated edit
                screen, then come back here to review the saved version.
              </p>

              <AccentButton
                tone="emerald"
                onClick={() => navigate("/coach-profile/edit")}
                className="max-w-sm justify-between"
              >
                <span>Start coach profile setup</span>
                <ArrowRight className="h-4 w-4" />
              </AccentButton>
            </CardContent>
          </GlassCard>
        </section>
      </CaloriexPage>
    );
  }

  return (
    <CaloriexPage>
      <PageHero
        leading={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="w-fit rounded-full border border-white/60 bg-white/55 px-4 text-xs text-slate-600 backdrop-blur hover:bg-white/70 hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            Back to profile
          </Button>
        }
        badge={<HeroBadge>Coach profile</HeroBadge>}
        title="Review the public coach profile users see before they send a request."
        description="This page is now focused on previewing the saved coach offer, while editing happens in its own dedicated workspace."
        chips={[
          "Preview mode",
          `${activeAvailability.length} active day${activeAvailability.length === 1 ? "" : "s"}`,
          downloadableCertificates.length > 0 ? "Certificates uploaded" : "No certificates",
        ]}
        aside={
          <CoachProfileHeroAside
            maxCapacity={formData.maxCapacity}
            trainingFormatLabel={trainingFormatLabel}
            certificateCount={downloadableCertificates.length}
          />
        }
      />

      <section className="relative container mx-auto px-6 py-12 md:py-16">
        {errorMessage ? <NoticeCard tone="danger" className="mb-6">{errorMessage}</NoticeCard> : null}
        {statusMessage ? <NoticeCard tone="success" className="mb-6">{statusMessage}</NoticeCard> : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_360px]">
          <div className="space-y-6">
            <CoachProfileOverviewCard
              trainingFormatLabel={trainingFormatLabel}
              priceRange={priceRange}
              activeDayCount={activeAvailability.length}
            />
            <CoachProfileOfferPanel
              startedCoachingAt={formData.startedCoachingAt}
              trainingFormatLabel={trainingFormatLabel}
              maxCapacity={formData.maxCapacity}
              priceRange={priceRange}
            />
            <CoachProfilePublicInfoPanel
              description={formData.description}
              contactNote={formData.contactNote}
              activeAvailability={activeAvailability}
            />
          </div>

          <div className="space-y-6">
            <CoachProfileCertificatesPanel
              certificates={downloadableCertificates}
              onDownload={openCoachCertificate}
            />

            <GlassCard className="overflow-hidden">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-cyan-300/50 bg-cyan-100/70 p-3 text-slate-700">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                      Next step
                    </p>
                    <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                      Refine your offer
                    </h3>
                  </div>
                </div>

                <p className="text-sm leading-6 text-slate-600">
                  Open the dedicated edit page whenever your schedule, positioning, or
                  pricing changes.
                </p>

                <AccentButton
                  tone="sky"
                  onClick={() => navigate("/coach-profile/edit")}
                  className="justify-between"
                >
                  <span>Edit coach profile</span>
                  <ArrowRight className="h-4 w-4" />
                </AccentButton>
              </CardContent>
            </GlassCard>
          </div>
        </div>
      </section>
    </CaloriexPage>
  );
}
