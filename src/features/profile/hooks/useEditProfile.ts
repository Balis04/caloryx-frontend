import { useState, useMemo, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import type { ProfileResponse } from "../types/profile.types";
import type { ProfileEditData } from "../types/profile.types";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

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
        navigate("/register");
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
  }, [getAccessTokenSilently, navigate]);

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
    const requiredFields: (keyof ProfileEditData)[] = [
      "fullName",
      "birthDate",
      "gender",
      "userRole",
      "heightCm",
      "startWeightKg",
      "actualWeightKg",
      "targetWeightKg",
      "weeklyGoalKg",
      "activityLevel",
      "goal",
    ];

    const allFilled = requiredFields.every(
      (key) => userProfile[key] !== "" && userProfile[key] !== null
    );
    if (!allFilled) return false;

    const birthDate = new Date(userProfile.birthDate);
    const isDateValid =
      birthDate >= new Date("1900-01-01") && birthDate <= new Date();
    if (!isDateValid) return false;

    const isStatsValid =
      Number(userProfile.heightCm) > 0 &&
      Number(userProfile.startWeightKg) > 0 &&
      Number(userProfile.actualWeightKg) > 0 &&
      Number(userProfile.targetWeightKg) > 0 &&
      Number(userProfile.weeklyGoalKg) >= 0;

    return isStatsValid;
  }, [userProfile]);

  return { loading, userProfile, setField, loadUser, saveUserProfile, canSave };
};
