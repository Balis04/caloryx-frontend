import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/use-auth";
import { getProfile, updateProfile } from "../api/profile.api";
import {
  mapProfileFormValuesToRequest,
  mapProfileResponseToFormValues,
} from "../lib/profile.mapper";
import { canSaveProfileForm } from "../lib/profile.validation";
import {
  initialProfileFormValues,
  type ProfileFormValues,
} from "../lib/profile.form";

export const useProfileEditForm = () => {
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
        setValues(mapProfileResponseToFormValues(response));
      } catch (error: unknown) {
        console.error("Load error:", error);
        navigate("/register");
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [navigate]);

  const saveProfile = async () => {
    try {
      await updateProfile(mapProfileFormValuesToRequest(values));
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

