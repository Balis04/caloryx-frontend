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
  const [error, setError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getProfile();
        setProfile(response);
        setFormData(createInitialTrainingRequestFormData(response));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile data.");
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
      setError("The selected coach ID is missing.");
      return false;
    }

    setSubmitting(true);
    setError(null);
    setSubmitMessage(null);

    try {
      await createTrainingRequest(
        coachProfileId,
        mapTrainingRequestFormDataToRequest(formData)
      );
      setSubmitMessage("Your training plan request was sent successfully to the coach.");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send the request.");
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
    error,
    submitMessage,
    setField,
    submit,
    canSubmit: canSubmitTrainingRequestForm(formData),
  };
};

