import {
  ACTIVITY_OPTIONS,
  GENDER_OPTIONS,
} from "@/shared/constants/user-options";
import { getLabelFromOptions } from "@/shared/utils/optionMapper";
import { Activity, User } from "lucide-react";
import { formatBirthDate } from "../lib/profile.formatters";
import type { Profile } from "../model/profile.model";
import ProfileField from "./ProfileField";

interface Props {
  profile: Profile;
}

export default function ProfileBasicSection({ profile }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
          <User className="w-3 h-3" /> Basic Information
        </h3>
        <ProfileField label="Name" value={profile.fullName} />
        <ProfileField label="Birth date" value={formatBirthDate(profile.birthDate)} />
        <ProfileField
          label="Gender"
          value={getLabelFromOptions(GENDER_OPTIONS, profile.gender)}
        />
        <ProfileField label="Height" value={`${profile.heightCm} cm`} />
      </div>

      <div className="space-y-1">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
          <Activity className="w-3 h-3" /> Physical Stats
        </h3>
        <ProfileField label="Starting weight" value={`${profile.startWeightKg} kg`} />
        <ProfileField label="Current weight" value={`${profile.actualWeightKg} kg`} />
        <ProfileField
          label="Activity level"
          value={getLabelFromOptions(ACTIVITY_OPTIONS, profile.activityLevel)}
        />
      </div>
    </div>
  );
}
