import { CaloriexPage} from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CoachProfileStatusNotices from "../shared/CoachProfileStatusNotices";
import CoachProfileOverviewCard from "./CoachProfileOverviewCard";
import CoachProfileNextStepPanel from "./CoachProfileNextStepPanel";
import {
  CoachProfileCertificatesPanel,
  CoachProfileOfferPanel,
  CoachProfilePublicInfoPanel,
} from "./CoachProfileReadonlyPanels";
import type { CoachCertificate } from "../../model/coach-profile.types";

export default function CoachProfileViewWorkspace({
  maxCapacity,
  trainingFormatLabel,
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
      <section className="relative container mx-auto px-6 pb-12 md:pb-16">
        <CoachProfileStatusNotices
          errorMessage={errorMessage}
          statusMessage={statusMessage}
        />
        <Button
            variant="ghost"
            size="sm"
            onClick={onBackToProfile}
            className=" mb-2.5 w-fit rounded-full border border-white/60 bg-white/55 px-4 text-xs text-slate-600 backdrop-blur hover:bg-white/70 hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            Back to profile
          </Button>
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
