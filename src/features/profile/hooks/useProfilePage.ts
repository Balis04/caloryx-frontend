import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ACTIVITY_OPTIONS,
  GOAL_OPTIONS,
  GENDER_OPTIONS,
  USER_ROLE_OPTIONS,
} from "@/shared/constants/user-options";
import { getLabelFromOptions } from "@/shared/utils/optionMapper";
import { useProfileQuery } from "./useProfileQuery";
import { canManageCoachProfile } from "../lib/profile.permissions";
import {
  calculateProgress,
  formatWeeklyGoal,
  getProgressMessage,
} from "../lib/profile.formatters";

export const useProfilePage = () => {
  const navigate = useNavigate();
  const { profile, loading, error } = useProfileQuery();

  const viewModel = useMemo(() => {
    if (!profile) {
      return null;
    }

    const roleLabel = getLabelFromOptions(USER_ROLE_OPTIONS, profile.role);
    const genderLabel = getLabelFromOptions(GENDER_OPTIONS, profile.gender);
    const goalLabel = getLabelFromOptions(GOAL_OPTIONS, profile.goal);
    const activityLabel = getLabelFromOptions(
      ACTIVITY_OPTIONS,
      profile.activityLevel
    );
    const progressValue = calculateProgress(profile);
    const progressMessage = getProgressMessage(profile);
    const weeklyTarget = formatWeeklyGoal(profile.goal, profile.weeklyGoalKg);

    return {
      profile,
      roleLabel,
      genderLabel,
      goalLabel,
      activityLabel,
      progressValue,
      progressMessage,
      weeklyTarget,
      canManageCoachProfile: canManageCoachProfile(profile.role),
    };
  }, [profile]);

  return {
    profile: viewModel,
    loading,
    error,
    onEditProfile: () => navigate("/profile/edit"),
    onOpenCoachProfile: () => navigate("/coach-profile"),
  };
};
