import { getProfile } from "@/features/profile/api/profile.api";
import type { ProfileResponse } from "@/features/profile/types";
import { useEffect, useState } from "react";
import { createTrainingRequest } from "../api/training-request-create.api";
import { createInitialTrainingRequestFormData } from "../lib/training-request.form";
import { mapTrainingRequestFormDataToRequest } from "../lib/training-request-form.mapper";
import { canSubmitTrainingRequestForm } from "../lib/training-request.validation";
import type { TrainingRequestFormData } from "../types";

export const useTrainingRequestForm = (
  coachProfileId: string | null
) => {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [formData, setFormData] = useState<TrainingRequestFormData>(
    createInitialTrainingRequestFormData()
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);

      try {
        const response = await getProfile();
        setProfile(response);
        setFormData(createInitialTrainingRequestFormData(response));
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, []);

  const setField = <K extends keyof TrainingRequestFormData>(
    key: K,
    value: TrainingRequestFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    if (!coachProfileId) {
      return false;
    }

    setSubmitting(true);

    try {
      await createTrainingRequest(
        coachProfileId,
        mapTrainingRequestFormDataToRequest(formData)
      );
      return true;
    } catch {
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    profile,
    formData,
    loading,
    submitting,
    setField,
    submit,
    canSubmit: canSubmitTrainingRequestForm(formData),
  };
};

