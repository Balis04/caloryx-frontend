import { Separator } from "@/components/ui/separator";
import type { Profile } from "../model/profile.model";
import ProfileBasicSection from "./ProfileBasicSection";

interface Props {
  profile: Profile;
}

export default function ProfileBodySection({ profile }: Props) {
  return (
    <>
      <ProfileBasicSection profile={profile} />
      <Separator className="lg:hidden" />
    </>
  );
}
