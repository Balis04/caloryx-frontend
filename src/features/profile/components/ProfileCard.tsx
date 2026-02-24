import { useNavigate } from "react-router-dom";
import ProfileField from "./ProfileField";
import type { ProfileResponse } from "../types/profile.types";

import {
  GENDER_OPTIONS,
  ACTIVITY_OPTIONS,
  GOAL_OPTIONS,
} from "@/shared/constants/user-options";

import { getLabelFromOptions } from "@/shared/utils/optionMapper";

interface Props {
  profile: ProfileResponse;
}

export default function ProfileCard({ profile }: Props) {
  const navigate = useNavigate();

  const formattedDate = new Date(profile.birthDate).toLocaleDateString("hu-HU");

  const totalToLose = profile.startWeightKg - profile.targetWeightKg;
  const lostSoFar = profile.startWeightKg - profile.actualWeightKg;

  const progress =
    totalToLose > 0 ? Math.min((lostSoFar / totalToLose) * 100, 100) : 0;

  return (
    <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="text-2xl font-bold">Profil</h1>

      <ProfileField label="Név" value={profile.fullName} />
      <ProfileField label="Születési dátum" value={formattedDate} />
      <ProfileField
        label="Nem"
        value={getLabelFromOptions(GENDER_OPTIONS, profile.gender)}
      />
      <ProfileField label="Magasság" value={`${profile.heightCm} cm`} />
      <ProfileField label="Kezdő súly" value={`${profile.startWeightKg} kg`} />
      <ProfileField
        label="Jelenlegi súly"
        value={`${profile.actualWeightKg} kg`}
      />
      <ProfileField label="Cél súly" value={`${profile.targetWeightKg} kg`} />
      <ProfileField label="Heti cél" value={`${profile.weeklyGoalKg} kg`} />

      <ProfileField
        label="Aktivitási szint"
        value={getLabelFromOptions(ACTIVITY_OPTIONS, profile.activityLevel)}
      />

      <ProfileField
        label="Cél"
        value={getLabelFromOptions(GOAL_OPTIONS, profile.goal)}
      />

      <div>
        <div className="mb-1 text-sm text-gray-500">Haladás</div>
        <div className="h-3 w-full rounded-full bg-gray-200">
          <div
            className="h-3 rounded-full bg-black transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1 text-xs text-gray-500">
          {lostSoFar.toFixed(1)} kg fogyás
        </div>
      </div>

      <button
        onClick={() => navigate("/profile/edit")}
        className="w-full rounded-xl bg-black py-2 text-white transition hover:opacity-90"
      >
        Profil szerkesztése
      </button>
    </div>
  );
}
