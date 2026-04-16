import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/use-auth";
import { useProfileApi } from "../api/profile.api";
import {
  mapProfileFormValuesToUpdateRequest,
  mapProfileToFormValues,
} from "../lib/profile.mapper";
import { canSaveProfileForm } from "../lib/profile.validation";
import {
  initialProfileFormValues,
  type ProfileFormValues,
} from "../model/profile.form";

export const useProfileEditForm = () => {
  const { getProfile, updateProfile } = useProfileApi();
  const { refreshAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState<ProfileFormValues>(
    initialProfileFormValues
  );
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);

      try {
        const response = await getProfile();
        setValues(mapProfileToFormValues(response));
      } catch (error: unknown) {
        console.error("Load error:", error);
        navigate("/register");
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [getProfile, navigate]);

  const saveProfile = async () => {
    try {
      await updateProfile(mapProfileFormValuesToUpdateRequest(values));
      await refreshAuth();
      return true;
    } catch (error) {
      console.error("Save error:", error);
      return false;
    }
  };

  const setField = <K extends keyof ProfileFormValues>(
    key: K,
    value: ProfileFormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const canSave = canSaveProfileForm(values);

  return {
    loading,
    values,
    setField,
    saveProfile,
    canSave,
  };
};
