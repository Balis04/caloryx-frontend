import { Progress } from "@/components/ui/progress";
import { GOAL_OPTIONS } from "@/shared/constants/user-options";
import { getLabelFromOptions } from "@/shared/utils/optionMapper";
import { Target } from "lucide-react";
import {
  calculateProgress,
  formatWeeklyGoal,
  getProgressMessage,
} from "../lib/profile.formatters";
import type { Profile } from "../model/profile.model";
import ProfileField from "./ProfileField";

interface Props {
  profile: Profile;
}

export default function ProfileGoalSection({ profile }: Props) {
  const progressValue = calculateProgress(profile);
  const message = getProgressMessage(profile);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
          <Target className="w-3 h-3" /> Goals
        </h3>
        <ProfileField label="Target weight" value={`${profile.targetWeightKg} kg`} />
        <ProfileField
          label="Weekly target"
          value={formatWeeklyGoal(profile.goal, profile.weeklyGoalKg)}
        />
        <ProfileField
          label="Goal type"
          value={getLabelFromOptions(GOAL_OPTIONS, profile.goal)}
        />
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Progress
          </span>
          <span className="text-lg font-black text-primary leading-none">
            {progressValue.toFixed(0)}%
          </span>
        </div>

        <Progress value={progressValue} className="h-2.5 w-full" />

        <p className="text-[11px] text-center text-muted-foreground leading-tight italic pt-1">
          {message}
        </p>
      </div>
    </div>
  );
}
