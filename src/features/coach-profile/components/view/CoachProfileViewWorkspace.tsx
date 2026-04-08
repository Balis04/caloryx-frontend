import { CaloriexPage, HeroBadge, PageHero } from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CoachProfileHeroAside from "../shared/CoachProfileHeroAside";
import CoachProfileStatusNotices from "../shared/CoachProfileStatusNotices";
import CoachProfileOverviewCard from "./CoachProfileOverviewCard";
import CoachProfileNextStepPanel from "./CoachProfileNextStepPanel";
import {
  CoachProfileCertificatesPanel,
  CoachProfileOfferPanel,
  CoachProfilePublicInfoPanel,
} from "./CoachProfileReadonlyPanels";
import type { CoachCertificate } from "../../types/coach-profile.types";

export default function CoachProfileViewWorkspace({
  maxCapacity,
  trainingFormatLabel,
  certificateCount,
  activeAvailability,
  downloadableCertificates,
  startedCoachingAt,
  priceRange,
  description,
  contactNote,
  errorMessage,
  statusMessage,
  onBackToProfile,
  onOpenEditor,
  onDownloadCertificate,
}: {
  maxCapacity: string;
  trainingFormatLabel: string;
  certificateCount: number;
  activeAvailability: string[];
  downloadableCertificates: CoachCertificate[];
  startedCoachingAt: string;
  priceRange: string;
  description: string;
  contactNote: string;
  errorMessage: string | null;
  statusMessage: string | null;
  onBackToProfile: () => void;
  onOpenEditor: () => void;
  onDownloadCertificate: (certificate: CoachCertificate) => void;
}) {
  return (
    <CaloriexPage>
      <PageHero
        leading={
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToProfile}
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
            maxCapacity={maxCapacity}
            trainingFormatLabel={trainingFormatLabel}
            certificateCount={certificateCount}
          />
        }
      />

      <section className="relative container mx-auto px-6 pb-12 md:pb-16">
        <CoachProfileStatusNotices
          errorMessage={errorMessage}
          statusMessage={statusMessage}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_360px]">
          <div className="space-y-6">
            <CoachProfileOverviewCard
              trainingFormatLabel={trainingFormatLabel}
              priceRange={priceRange}
              activeDayCount={activeAvailability.length}
            />
            <CoachProfileOfferPanel
              startedCoachingAt={startedCoachingAt}
              trainingFormatLabel={trainingFormatLabel}
              maxCapacity={maxCapacity}
              priceRange={priceRange}
            />
            <CoachProfilePublicInfoPanel
              description={description}
              contactNote={contactNote}
              activeAvailability={activeAvailability}
            />
          </div>

          <div className="space-y-6">
            <CoachProfileCertificatesPanel
              certificates={downloadableCertificates}
              onDownload={onDownloadCertificate}
            />
            <CoachProfileNextStepPanel onEdit={onOpenEditor} />
          </div>
        </div>
      </section>
    </CaloriexPage>
  );
}
