import { Dumbbell, Send, UserRound } from "lucide-react";

import { ReadonlyField, SummaryPanel } from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { TrainingRequestFormData } from "@/features/training-requests/types";

const fieldClassName =
  "flex h-11 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-2 text-sm text-slate-900 shadow-sm outline-none backdrop-blur transition focus-visible:ring-2 focus-visible:ring-sky-300/60";

export default function TrainingRequestFormSection({
  formData,
  goalLabel,
  activityLevelLabel,
  onFieldChange,
}: {
  formData: TrainingRequestFormData;
  goalLabel?: string;
  activityLevelLabel?: string;
  onFieldChange: <K extends keyof TrainingRequestFormData>(
    key: K,
    value: TrainingRequestFormData[K]
  ) => void;
}) {
  return (
    <SummaryPanel eyebrow="New request" title="Training plan request" icon={Send}>
      <CardContent className="space-y-8 pt-6">
        <p className="text-sm leading-7 text-slate-600">
          Enter your main preferences and describe what kind of plan you want to
          receive from the selected coach.
        </p>
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <UserRound className="h-5 w-5 text-slate-700" />
            <h2 className="text-lg font-semibold text-slate-950">Profile-based details</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <ReadonlyField label="Current weight" value={formData.currentWeightKg} fallback="Add your current weight on the profile page" />
            <ReadonlyField label="Target weight" value={formData.targetWeightKg} fallback="Add your target weight on the profile page" />
            <ReadonlyField label="Goal" value={goalLabel} fallback="Set your goal on the profile page" />
            <ReadonlyField label="Activity level" value={activityLevelLabel} fallback="Set your activity level on the profile page" />
          </div>
          <div className="cx-glass-block rounded-[24px] p-4 text-sm text-slate-600">
            These values are shown for reference and come from your profile. If you want
            to change them, update them on the profile page first.
          </div>
        </section>
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-slate-700" />
            <h2 className="text-lg font-semibold text-slate-950">Training preferences</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="weeklyWorkouts">How many sessions per week do you want?</Label>
              <Input id="weeklyWorkouts" type="number" min="1" placeholder="e.g. 3" className={fieldClassName} value={formData.weeklyWorkouts} onChange={(event) => onFieldChange("weeklyWorkouts", event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredSessionLength">Session length in minutes</Label>
              <Input id="preferredSessionLength" type="number" min="15" placeholder="e.g. 60" className={fieldClassName} value={formData.preferredSessionLength} onChange={(event) => onFieldChange("preferredSessionLength", event.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="trainingLocation">Where would you like to train?</Label>
              <Input id="trainingLocation" placeholder="e.g. gym, home, outdoors" className={fieldClassName} value={formData.trainingLocation} onChange={(event) => onFieldChange("trainingLocation", event.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="customerDescription">Short description for the coach</Label>
              <textarea id="customerDescription" value={formData.customerDescription} onChange={(event) => onFieldChange("customerDescription", event.target.value)} placeholder="Describe your goals, experience level, any injuries, or anything else the coach should know." className="min-h-36 w-full rounded-[24px] border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none backdrop-blur transition focus-visible:ring-2 focus-visible:ring-sky-300/60" />
            </div>
          </div>
        </section>
      </CardContent>
    </SummaryPanel>
  );
}

