import { CaloriexPage, NoticeCard } from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CoachProfileCreatePromptPanel from "../components/create/CoachProfileCreatePromptPanel";
import CoachProfileStatusNotices from "../components/shared/CoachProfileStatusNotices";
import CoachProfileNextStepPanel from "../components/view/CoachProfileNextStepPanel";
import CoachProfileOverviewCard from "../components/view/CoachProfileOverviewCard";
import {
  CoachProfileCertificatesPanel,
  CoachProfileOfferPanel,
  CoachProfilePublicInfoPanel,
} from "../components/view/CoachProfileReadonlyPanels";
import { useCoachProfilePage } from "../hooks/useCoachProfilePage";
import { openCoachCertificate } from "../lib/coach-profile.certificates";
import {
  formatPriceRange,
  getTrainingFormatLabel,
} from "../lib/coach-profile.formatters";

export default function CoachProfilePage() {
  const navigate = useNavigate();
  const { formData, loading, errorMessage, isForbidden, hasCoachProfile } =
    useCoachProfilePage();

  const downloadableCertificates = formData.certificates.filter(
    (certificate) => certificate.fileUrl
  );
  const activeAvailability = formData.availability
    .filter((slot) => slot.enabled)
    .map((slot) => `${slot.label} ${slot.from}-${slot.until}`);
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
        <section className="container mx-auto px-6 pb-12 md:pb-16">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="mb-2.5 w-fit rounded-full border border-white/60 bg-white/55 px-4 text-xs text-slate-600 backdrop-blur hover:bg-white/70 hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            Back to profile
          </Button>
          <CoachProfileStatusNotices
            errorMessage={errorMessage}
            statusMessage={null}
          />
          <CoachProfileCreatePromptPanel
            onStart={() => navigate("/coach-profile/edit")}
          />
        </section>
      </CaloriexPage>
    );
  }

  return (
    <CaloriexPage>
      <section className="relative container mx-auto px-6 pb-12 md:pb-16">
        <CoachProfileStatusNotices
          errorMessage={errorMessage}
          statusMessage={null}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/profile")}
          className="mb-2.5 w-fit rounded-full border border-white/60 bg-white/55 px-4 text-xs text-slate-600 backdrop-blur hover:bg-white/70 hover:text-slate-900"
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
            <CoachProfileNextStepPanel
              onEdit={() => navigate("/coach-profile/edit")}
            />
          </div>
        </div>
      </section>
    </CaloriexPage>
  );
}

