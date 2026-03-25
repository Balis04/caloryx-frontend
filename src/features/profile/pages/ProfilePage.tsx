import ProfileCard from "../components/ProfileCard";
import { useProfileService } from "../hooks/useProfileService";
import { useEffect, useState } from "react";
import type { ProfileResponse } from "../types/profile.types";

export default function ProfilePage() {
  const { getProfile } = useProfileService();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [getProfile]);

  if (loading) return <div className="p-10 italic">Loading...</div>;

  if (!profile) {
    return <div className="p-10 text-red-500">Failed to load profile.</div>;
  }

  return (
    <div className="flex justify-center mt-2 px-4">
      <ProfileCard profile={profile} />
    </div>
  );
}
