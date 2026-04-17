import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api-client";
import { getMyCoachProfile } from "../api/coach-profile.api";
import { mapCoachProfileResponseToFormData } from "../lib/coach-profile.mapper";
import { initialCoachProfileFormData } from "../model/coach-profile.form";
import type {
  CoachProfileFormData,
  CoachProfileResponse,
} from "../model/coach-profile.types";

interface CoachProfilePageState {
  coachProfileId: string | null;
  errorMessage: string | null;
  formData: CoachProfileFormData;
  hasCoachProfile: boolean;
  isForbidden: boolean;
}

const createEmptyCoachProfileState = (
  overrides: Partial<CoachProfilePageState> = {}
): CoachProfilePageState => ({
  coachProfileId: null,
  errorMessage: null,
  formData: initialCoachProfileFormData,
  hasCoachProfile: false,
  isForbidden: false,
  ...overrides,
});

const mapCoachProfileResponseToState = (
  response: CoachProfileResponse
): CoachProfilePageState => ({
  coachProfileId: response.id,
  errorMessage: null,
  formData: mapCoachProfileResponseToFormData(response),
  hasCoachProfile: true,
  isForbidden: false,
});

const mapCoachProfileErrorToState = (error: unknown): CoachProfilePageState => {
  if (error instanceof ApiError && (error.status === 400 || error.status === 404)) {
    return createEmptyCoachProfileState();
  }

  if (error instanceof ApiError && error.status === 403) {
    return createEmptyCoachProfileState({
      errorMessage: error.message,
      isForbidden: true,
    });
  }

  return createEmptyCoachProfileState({
    errorMessage:
      error instanceof Error ? error.message : "Failed to load coach profile.",
  });
};

export const useCoachProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<CoachProfilePageState>(createEmptyCoachProfileState());

  useEffect(() => {
    const loadCoachProfile = async () => {
      setLoading(true);

      try {
        const response = await getMyCoachProfile();
        setState(mapCoachProfileResponseToState(response));
      } catch (error) {
        setState(mapCoachProfileErrorToState(error));
      } finally {
        setLoading(false);
      }
    };

    void loadCoachProfile();
  }, []);

  return {
    ...state,
    loading,
  };
};
