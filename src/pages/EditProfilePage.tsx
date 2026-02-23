import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export default function EditProfilePage() {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [actualWeightKg, setActualWeightKg] = useState("");
  const [targetWeightKg, setTargetWeightKg] = useState("");
  const [weeklyGoalKg, setWeeklyGoalKg] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const token = await getAccessTokenSilently();

      const res = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        navigate("/register", { replace: true });
        return;
      }

      const data = await res.json();

      setFullName(data.fullName ?? "");
      setActualWeightKg(data.actualWeightKg ?? "");
      setTargetWeightKg(data.targetWeightKg ?? "");
      setWeeklyGoalKg(data.weeklyGoalKg ?? "");

      setLoading(false);
    };

    loadUser();
  }, [getAccessTokenSilently, navigate]);

  const handleSave = async () => {
    const token = await getAccessTokenSilently();

    await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName,
        startWeightKg: Number(actualWeightKg),
        targetWeightKg: Number(targetWeightKg),
        weeklyGoalKg: Number(weeklyGoalKg),
      }),
    });

    navigate("/profile");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex justify-center mt-20">
      <div className="space-y-4 w-96">
        <h1 className="text-2xl font-bold">Profile</h1>

        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          value={actualWeightKg}
          onChange={(e) => setActualWeightKg(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          value={targetWeightKg}
          onChange={(e) => setTargetWeightKg(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          step="0.1"
          value={weeklyGoalKg}
          onChange={(e) => setWeeklyGoalKg(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          onClick={handleSave}
          className="w-full bg-black text-white p-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
}
