import { CaloriexPage, HeroBadge, NoticeCard, PageHero } from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CoachProfileHeroAside from "../shared/CoachProfileHeroAside";
import CoachProfileStatusNotices from "../shared/CoachProfileStatusNotices";
import CoachProfileCreatePromptPanel from "./CoachProfileCreatePromptPanel";

export default function CoachProfileCreateWorkspace({
  maxCapacity,
  trainingFormatLabel,
  certificateCount,
  errorMessage,
  statusMessage,
  onBackToProfile,
  onOpenEditor,
}: {
  maxCapacity: string;
  trainingFormatLabel: string;
  certificateCount: number;
  errorMessage: string | null;
  statusMessage: string | null;
  onBackToProfile: () => void;
  onOpenEditor: () => void;
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
        title="Create the public coaching profile users will see before they reach out."
        description="Set up your positioning, schedule, pricing, and certificate proof in a dedicated editing workspace."
        chips={["No profile yet", "Coach-only workspace", "Public-facing setup"]}
        aside={
          <CoachProfileHeroAside
            maxCapacity={maxCapacity}
            trainingFormatLabel={trainingFormatLabel}
            certificateCount={certificateCount}
          />
        }
      />

      <section className="container mx-auto px-6 py-12 md:py-16">
        <CoachProfileStatusNotices
          errorMessage={errorMessage}
          statusMessage={statusMessage}
        />
        <CoachProfileCreatePromptPanel onStart={onOpenEditor} />
      </section>
    </CaloriexPage>
  );
}
