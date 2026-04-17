import { useProfileApi } from "@/features/profile/api/profile.api";
import type { ProfileResponse } from "@/features/profile/model/profile.types";
import { useEffect, useState } from "react";
import { createTrainingRequest } from "../api/training-request.api";
import { mapTrainingRequestFormDataToRequest } from "../lib/training-request.mapper";
import type { TrainingRequestFormData } from "../model/training-request.types";

const createInitialFormData = (
  profile?: ProfileResponse | null
): TrainingRequestFormData => ({
  weeklyWorkouts: "",
  preferredSessionLength: "",
  trainingLocation: "",
  currentWeightKg: profile?.actualWeightKg ? String(profile.actualWeightKg) : "",
  targetWeightKg: profile?.targetWeightKg ? String(profile.targetWeightKg) : "",
  goal: profile?.goal ?? "",
  activityLevel: profile?.activityLevel ?? "",
  customerDescription: "",
});

export const useTrainingRequestForm = (
  coachProfileId: string | null
) => {
  const { getProfile } = useProfileApi();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [formData, setFormData] = useState<TrainingRequestFormData>(
    createInitialFormData()
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
        setFormData(createInitialFormData(response));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [getProfile]);

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

  const canSubmit =
    formData.weeklyWorkouts.trim().length > 0 &&
    formData.preferredSessionLength.trim().length > 0 &&
    formData.trainingLocation.trim().length > 0 &&
    formData.customerDescription.trim().length >= 20;

  return {
    profile,
    formData,
    loading,
    submitting,
    error,
    submitMessage,
    setField,
    submit,
    canSubmit,
  };
};
