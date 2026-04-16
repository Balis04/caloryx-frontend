import { useProfileApi } from "@/features/profile/api/profile.api";
import type { ProfileResponseDto } from "@/features/profile/model/profile.types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTrainingRequestApi } from "../../shared/api/training-request.api";
import { mapTrainingRequestFormToCreateDto } from "../lib/training-request.mapper";
import type { TrainingRequestFormData } from "../types/training-request-form.types";

const createInitialFormData = (
  profile?: ProfileResponseDto | null
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

export interface UseTrainingRequestFormResult {
  profile: ProfileResponseDto | null;
  formData: TrainingRequestFormData;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  submitMessage: string | null;
  setField: <K extends keyof TrainingRequestFormData>(
    key: K,
    value: TrainingRequestFormData[K]
  ) => void;
  submit: () => Promise<boolean>;
  canSubmit: boolean;
}

export const useTrainingRequestForm = (
  coachProfileId: string | null
): UseTrainingRequestFormResult => {
  const { getProfile } = useProfileApi();
  const { createTrainingRequest } = useTrainingRequestApi();
  const [profile, setProfile] = useState<ProfileResponseDto | null>(null);
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
      const nextProfile = response;
      setProfile(nextProfile);
      setFormData(createInitialFormData(nextProfile));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile data.");
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
      setError("The selected coach ID is missing.");
      return false;
    }

    setSubmitting(true);
    setError(null);
    setSubmitMessage(null);

    try {
      await createTrainingRequest(
        coachProfileId,
        mapTrainingRequestFormToCreateDto(formData)
      );
      setSubmitMessage("Your training plan request was sent successfully to the coach.");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send the request.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [coachProfileId, createTrainingRequest, formData]);

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
