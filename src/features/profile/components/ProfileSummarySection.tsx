import { Badge } from "@/components/ui/badge";
import { USER_ROLE_OPTIONS } from "@/shared/constants/user-options";
import { User } from "lucide-react";
import type { Profile } from "../model/profile.model";

interface Props {
  profile: Profile;
}

export default function ProfileSummarySection({ profile }: Props) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <User className="w-5 h-5 text-primary" /> User Profile
      </h2>
      <Badge variant="secondary" className="capitalize">
        {USER_ROLE_OPTIONS.find((option) => option.value === profile.role)?.label ??
          "User"}
      </Badge>
    </div>
  );
}
