import ProfileCard from "../components/ProfileCard";
import { useProfileQuery } from "../hooks/useProfileQuery";

export default function ProfilePage() {
  const { profile, loading } = useProfileQuery();

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
