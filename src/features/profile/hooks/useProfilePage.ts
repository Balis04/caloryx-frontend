import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ACTIVITY_OPTIONS,
  GOAL_OPTIONS,
  GENDER_OPTIONS,
  USER_ROLE_OPTIONS,
} from "@/shared/constants/user-options";
import { getLabelFromOptions } from "@/shared/utils/optionMapper";
import { isCoachRole } from "@/shared/utils/profileRole";
import { getProfile } from "../api/profile.api";
import { formatWeeklyGoal } from "../lib/profile.formatters";
import type { ProfileResponse } from "../types";

export const useProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);

      try {
        const response = await getProfile();
        setProfile(response);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, []);

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
    const weeklyTarget = formatWeeklyGoal(profile.goal, profile.weeklyGoalKg);

    return {
      profile,
      roleLabel,
      genderLabel,
      goalLabel,
      activityLabel,
      weeklyTarget,
      canManageCoachProfile: isCoachRole(profile.role),
    };
  }, [profile]);

  return {
    profile: viewModel,
    loading,
    onEditProfile: () => navigate("/profile/edit"),
    onOpenCoachProfile: () => navigate("/coach-profile"),
  };
};

