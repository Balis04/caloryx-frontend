import { CaloriexPage} from "@/components/caloriex";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CoachProfileStatusNotices from "../shared/CoachProfileStatusNotices";
import CoachProfileCreatePromptPanel from "./CoachProfileCreatePromptPanel";

export default function CoachProfileCreateWorkspace({
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
      <section className="container mx-auto px-6 pb-12 md:pb-16">
        <Button
            variant="ghost"
            size="sm"
            onClick={onBackToProfile}
            className="mb-2.5 w-fit rounded-full border border-white/60 bg-white/55 px-4 text-xs text-slate-600 backdrop-blur hover:bg-white/70 hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            Back to profile
          </Button>
        <CoachProfileStatusNotices
          errorMessage={errorMessage}
          statusMessage={statusMessage}
        />
        <CoachProfileCreatePromptPanel onStart={onOpenEditor} />
      </section>
    </CaloriexPage>
  );
}
