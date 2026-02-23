import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

interface UserResponse {
  fullName: string;
  email: string;
  actualWeightKg: number;
  targetWeightKg: number;
  weeklyGoalKg: number;
  goal: string;
  activityLevel: string;
  heightCm: number;
}

export default function ProfilePage() {
  const { getAccessTokenSilently } = useAuth0();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await getAccessTokenSilently();

        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await res.json();
        setUser(data);
      } catch (e) {
        console.error("Profile load failed:", e);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [getAccessTokenSilently]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="flex justify-center mt-20">
      <div className="w-96 space-y-4 border p-6 rounded shadow">
        <h1 className="text-2xl font-bold">Profile</h1>

        <div>
          <strong>Name:</strong> {user.fullName}
        </div>

        <div>
          <strong>Email:</strong> {user.email}
        </div>

        <div>
          <strong>Current Weight:</strong> {user.actualWeightKg} kg
        </div>

        <div>
          <strong>Target Weight:</strong> {user.targetWeightKg} kg
        </div>

        <div>
          <strong>Weekly Goal:</strong> {user.weeklyGoalKg} kg
        </div>

        <div>
          <strong>Goal Type:</strong> {user.goal}
        </div>

        <div>
          <strong>Activity Level:</strong> {user.activityLevel}
        </div>

        <button
          onClick={() => navigate("/profile/edit")}
          className="w-full bg-black text-white p-2 rounded"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
