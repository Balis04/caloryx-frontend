import { ApiError } from "@/lib/api-client";

import { initialCoachProfileFormData } from "./coach-profile.form";
import { mapCoachProfileResponseToFormData } from "./coach-profile.mapper";
import type {
  CoachProfileFormData,
  CoachProfileResponse,
} from "../types";

export interface CoachProfileLoadState {
  coachProfileId: string | null;
  errorMessage: string | null;
  formData: CoachProfileFormData;
  hasCoachProfile: boolean;
  isForbidden: boolean;
}

export const createEmptyCoachProfileState = (
  overrides: Partial<CoachProfileLoadState> = {}
): CoachProfileLoadState => ({
  coachProfileId: null,
  errorMessage: null,
  formData: initialCoachProfileFormData,
  hasCoachProfile: false,
  isForbidden: false,
  ...overrides,
});

export const mapCoachProfileResponseToState = (
  response: CoachProfileResponse
): CoachProfileLoadState => ({
  coachProfileId: response.id,
  errorMessage: null,
  formData: mapCoachProfileResponseToFormData(response),
  hasCoachProfile: true,
  isForbidden: false,
});

export const mapCoachProfileErrorToState = (
  error: unknown
): CoachProfileLoadState => {
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
