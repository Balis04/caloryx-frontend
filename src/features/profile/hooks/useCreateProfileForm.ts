import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/use-auth";
import { createProfile } from "../api/profile.api";
import { mapProfileFormValuesToRequest } from "../lib/profile.mapper";
import { canSaveProfileForm } from "../lib/profile.validation";
import {
  initialProfileFormValues,
  type ProfileFormValues,
} from "../lib/profile.form";

export const useCreateProfileForm = () => {
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();
  const [values, setValues] = useState<ProfileFormValues>(
    initialProfileFormValues
  );

  const setField = <K extends keyof ProfileFormValues>(
    key: K,
    value: ProfileFormValues[K]
  ) => {
    setValues((previousValues) => ({
      ...previousValues,
      [key]: value,
    }));
  };

  const saveProfile = async () => {
    try {
      const payload = mapProfileFormValuesToRequest({
        ...values,
        actualWeightKg: values.startWeightKg,
      });

      await createProfile(payload);
      await refreshAuth();
      navigate("/profile");
      return true;
    } catch {
      return false;
    }
  };

  return {
    values,
    setField,
    canSave: canSaveProfileForm({
      ...values,
      actualWeightKg: values.startWeightKg,
    }),
    saveProfile,
  };
};

