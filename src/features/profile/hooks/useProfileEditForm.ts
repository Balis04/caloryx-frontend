import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/use-auth";
import { useProfileApi } from "../api/profile.api";
import {
  mapProfileDtoToModel,
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

  const loadProfile = useCallback(async () => {
    try {
      const response = await getProfile();
      const profile = mapProfileDtoToModel(response);
      setValues(mapProfileToFormValues(profile));
    } catch (error: unknown) {
      console.error("Load error:", error);
      navigate("/register");
    } finally {
      setLoading(false);
    }
  }, [getProfile, navigate]);

  const saveProfile = useCallback(async () => {
    try {
      await updateProfile(mapProfileFormValuesToUpdateRequest(values));
      await refreshAuth();
      return true;
    } catch (error) {
      console.error("Save error:", error);
      return false;
    }
  }, [refreshAuth, updateProfile, values]);

  const setField = useCallback(
    <K extends keyof ProfileFormValues>(key: K, value: ProfileFormValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const canSave = useMemo(() => canSaveProfileForm(values), [values]);

  return {
    loading,
    values,
    setField,
    loadProfile,
    saveProfile,
    canSave,
  };
};
