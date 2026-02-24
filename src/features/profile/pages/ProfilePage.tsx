import ProfileCard from "../components/ProfileCard";
import { useProfile } from "../hooks/useProfile";

export default function ProfilePage() {
  const { profile, loading, error } = useProfile();

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <div>Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center mt-20 text-red-500">{error}</div>
    );

  if (!profile) return null;

  return (
    <div className="flex justify-center mt-20 px-4">
      <ProfileCard profile={profile} />
    </div>
  );
}
