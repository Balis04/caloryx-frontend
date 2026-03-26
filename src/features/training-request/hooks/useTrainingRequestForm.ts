import { useProfileApi } from "@/features/profile/api/profile.api";
import { mapProfileDtoToModel } from "@/features/profile/lib/profile.mapper";
import type { Profile } from "@/features/profile/model/profile.model";
import { useApi } from "@/hooks/useApi";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { TrainingRequestFormData } from "../types/training-request-form.types";

const createInitialFormData = (
  profile?: Profile | null
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

export const useTrainingRequestForm = (coachProfileId: string | null) => {
  const { request } = useApi();
  const { getProfile } = useProfileApi();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState<TrainingRequestFormData>(
    createInitialFormData()
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getProfile();
      const nextProfile = mapProfileDtoToModel(response);
      setProfile(nextProfile);
      setFormData(createInitialFormData(nextProfile));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load profile data.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [getProfile]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const setField = useCallback(
    <K extends keyof TrainingRequestFormData>(
      key: K,
      value: TrainingRequestFormData[K]
    ) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const submit = useCallback(async () => {
    if (!coachProfileId) {
      setError("The selected trainer ID is missing.");
      return false;
    }

    setSubmitting(true);
    setError(null);
    setSubmitMessage(null);

    try {
      await request(`/api/coach-profiles/${coachProfileId}/training-requests`, {
        method: "POST",
        body: {
          weeklyTrainingCount: Number(formData.weeklyWorkouts),
          sessionDurationMinutes: Number(formData.preferredSessionLength),
          preferredLocation: formData.trainingLocation,
          coachNote: formData.customerDescription,
        },
      });
      setSubmitMessage("Your training plan request was sent successfully to the trainer.");
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send the request.";
      setError(message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [coachProfileId, formData, request]);

  const canSubmit = useMemo(
    () =>
      formData.weeklyWorkouts.trim().length > 0 &&
      formData.preferredSessionLength.trim().length > 0 &&
      formData.trainingLocation.trim().length > 0 &&
      formData.customerDescription.trim().length >= 20,
    [formData]
  );

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
