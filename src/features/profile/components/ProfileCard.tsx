import { useNavigate } from "react-router-dom";
import type { Profile } from "../model/profile.model";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit3, Briefcase } from "lucide-react";
import { canManageCoachProfile } from "../lib/profile.permissions";
import ProfileBodySection from "./ProfileBodySection";
import ProfileGoalSection from "./ProfileGoalSection";
import ProfileSummarySection from "./ProfileSummarySection";

interface Props {
  profile: Profile;
}

export default function ProfileCard({ profile }: Props) {
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-4xl shadow-xl border-t-4 border-t-primary">
      <CardHeader className="py-4 border-b">
        <CardTitle>
          <ProfileSummarySection profile={profile} />
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
          <ProfileBodySection profile={profile} />
          <ProfileGoalSection profile={profile} />
        </div>
      </CardContent>

      <CardFooter className="border-t bg-slate-50/50 py-4">
        <div className="flex w-full flex-col gap-3 lg:ml-auto lg:w-auto lg:flex-row">
          {canManageCoachProfile(profile.role) && (
            <Button
              variant="outline"
              onClick={() => navigate("/trainer-profile")}
              className="w-full lg:w-auto font-bold"
            >
              <Briefcase className="mr-2 w-4 h-4" />
              Trainer Profile
            </Button>
          )}
          <Button
            onClick={() => navigate("/profile/edit")}
            className="w-full lg:w-auto font-bold group"
          >
            <Edit3 className="mr-2 w-4 h-4" />
            Edit Profile
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
