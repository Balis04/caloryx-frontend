import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ACTIVITY_OPTIONS,
  GOAL_OPTIONS,
} from "@/shared/constants/user-options";
import { getLabelFromOptions } from "@/shared/utils/optionMapper";

import { useCoachDirectoryList } from "./useCoachDirectoryList";
import { useTrainingRequestForm } from "./useTrainingRequestForm";

export const useTrainingRequestFormPage = () => {
  const navigate = useNavigate();
  const { coachId } = useParams();
  const trainingRequestForm = useTrainingRequestForm(coachId ?? null);
  const coachDirectory = useCoachDirectoryList();

  const selectedCoach = useMemo(
    () =>
      coachDirectory.coaches.find((coach) => coach.id === (coachId ?? null)) ??
      null,
    [coachDirectory.coaches, coachId]
  );

  const goalLabel = trainingRequestForm.formData.goal
    ? getLabelFromOptions(GOAL_OPTIONS, trainingRequestForm.formData.goal)
    : undefined;
  const activityLevelLabel = trainingRequestForm.formData.activityLevel
    ? getLabelFromOptions(
        ACTIVITY_OPTIONS,
        trainingRequestForm.formData.activityLevel
      )
    : undefined;

  const handleSubmit = async () => {
    const success = await trainingRequestForm.submit();

    if (success) {
      navigate("/training-requests");
    }
  };

  return {
    activityLevelLabel,
    coachesLoading: coachDirectory.loading,
    formData: trainingRequestForm.formData,
    goalLabel,
    loading: trainingRequestForm.loading,
    canSubmit: trainingRequestForm.canSubmit,
    selectedCoach,
    setField: trainingRequestForm.setField,
    submitting: trainingRequestForm.submitting,
    submit: handleSubmit,
  };
};
