import { useState, useMemo, useCallback } from "react";
import { useProfileService } from "./useProfileService";
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
  const { getProfile, updateProfile } = useProfileService();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] =
    useState<ProfileEditData>(initialProfileData);
  const navigate = useNavigate();

  const loadUser = useCallback(async () => {
    try {
      const data = await getProfile();
      setUserProfile({
        ...data,
        birthDate: data.birthDate ? data.birthDate.split("T")[0] : "",
        heightCm: String(data.heightCm ?? ""),
        startWeightKg: String(data.startWeightKg ?? ""),
        actualWeightKg: String(data.actualWeightKg ?? ""),
        targetWeightKg: String(data.targetWeightKg ?? ""),
        weeklyGoalKg: String(data.weeklyGoalKg ?? ""),
        userRole: data.role,
      });
    } catch (error: unknown) {
      console.error("Hiba betöltéskor:", error);
      navigate("/register");
    } finally {
      setLoading(false);
    }
  }, [getProfile, navigate]);

  const saveUserProfile = async () => {
    try {
      await updateProfile({
        ...userProfile,
        role: userProfile.userRole,
        heightCm: Number(userProfile.heightCm),
        startWeightKg: Number(userProfile.startWeightKg),
        targetWeightKg: Number(userProfile.targetWeightKg),
        weeklyGoalKg: Number(userProfile.weeklyGoalKg),
        actualWeightKg: Number(userProfile.actualWeightKg),
      });
      return true;
    } catch (err) {
      console.error("Mentési hiba:", err);
      return false;
    }
  };

  const setField = useCallback(
    <K extends keyof ProfileEditData>(key: K, value: ProfileEditData[K]) => {
      setUserProfile((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

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
