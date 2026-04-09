import { ApiError } from "@/lib/api-client";
import { mapCoachProfileResponseToFormData } from "./coach-profile.mapper";
import { initialCoachProfileFormData } from "../model/coach-profile.form";
import type { CoachProfileResponseDto } from "../api/coach-profile.dto";
import type { CoachProfileFormData } from "../types/coach-profile.types";

export interface CoachProfileQueryState {
  coachProfileId: string | null;
  errorMessage: string | null;
  formData: CoachProfileFormData;
  hasCoachProfile: boolean;
  isForbidden: boolean;
}

export const createEmptyCoachProfileState = (
  overrides: Partial<CoachProfileQueryState> = {}
): CoachProfileQueryState => ({
  coachProfileId: null,
  errorMessage: null,
  formData: initialCoachProfileFormData,
  hasCoachProfile: false,
  isForbidden: false,
  ...overrides,
});

export const resolveCoachProfileQueryState = (
  response: CoachProfileResponseDto
): CoachProfileQueryState => ({
  coachProfileId: response.id,
  errorMessage: null,
  formData: mapCoachProfileResponseToFormData(response),
  hasCoachProfile: true,
  isForbidden: false,
});

export const mapCoachProfileQueryError = (error: unknown): CoachProfileQueryState => {
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
