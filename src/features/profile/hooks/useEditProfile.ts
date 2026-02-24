import { useState, useMemo, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import type { ProfileResponse } from "../types/profile.types";

export type ProfileEditData = Omit<
  ProfileResponse,
  | "heightCm"
  | "startWeightKg"
  | "actualWeightKg"
  | "targetWeightKg"
  | "weeklyGoalKg"
  | "role"
> & {
  heightCm: string;
  startWeightKg: string;
  actualWeightKg: string;
  targetWeightKg: string;
  weeklyGoalKg: string;
  userRole: ProfileResponse["role"];
};

const initialProfileData: ProfileEditData = {
  fullName: "",
  birthDate: "",
  gender: null,
  userRole: null,
  heightCm: "",
  startWeightKg: "",
  actualWeightKg: "",
  activityLevel: null,
  goal: null,
  targetWeightKg: "",
  weeklyGoalKg: "",
};

export const useEditProfile = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] =
    useState<ProfileEditData>(initialProfileData);

  const setField = useCallback(
    <K extends keyof ProfileEditData>(key: K, value: ProfileEditData[K]) => {
      setUserProfile((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const loadUser = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        window.location.replace("/register");
        return;
      }

      const data: ProfileResponse = await res.json();

      setUserProfile({
        fullName: data.fullName ?? "",
        birthDate: data.birthDate ? data.birthDate.split("T")[0] : "",
        gender: data.gender,
        userRole: data.role,
        heightCm: String(data.heightCm ?? ""),
        startWeightKg: String(data.startWeightKg ?? ""),
        actualWeightKg: String(data.actualWeightKg ?? ""),
        targetWeightKg: String(data.targetWeightKg ?? ""),
        weeklyGoalKg: String(data.weeklyGoalKg ?? ""),
        activityLevel: data.activityLevel,
        goal: data.goal,
      });
    } catch (error) {
      console.error("Hiba betöltéskor:", error);
    } finally {
      setLoading(false);
    }
  }, [getAccessTokenSilently]);

  const saveUserProfile = async () => {
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...userProfile,
          role: userProfile.userRole,
          heightCm: Number(userProfile.heightCm),
          startWeightKg: Number(userProfile.startWeightKg),
          targetWeightKg: Number(userProfile.targetWeightKg),
          weeklyGoalKg: Number(userProfile.weeklyGoalKg),
          actualWeightKg: Number(userProfile.actualWeightKg),
        }),
      });
      if (res.ok) {
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const canSave = useMemo(() => {
    return Object.values(userProfile).every(
      (value) => value !== "" && value !== null && value !== undefined
    );
  }, [userProfile]);

  return { loading, userProfile, setField, loadUser, saveUserProfile, canSave };
};
