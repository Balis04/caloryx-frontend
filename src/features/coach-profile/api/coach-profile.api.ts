import { apiClient } from "@/lib/api-client";
import type {
  CoachCertificateResponseDto,
  CoachProfileResponseDto,
  SaveCoachProfileRequestDto,
} from "../model/coach-profile.types";

const COACH_PROFILES_BASE_PATH = "/api/coach-profiles";

export const getMyCoachProfile = () =>
  apiClient<CoachProfileResponseDto>(`${COACH_PROFILES_BASE_PATH}/me`, {
    suppressErrorLog: true,
  });

export const createCoachProfile = (body: SaveCoachProfileRequestDto) =>
  apiClient<CoachProfileResponseDto>(COACH_PROFILES_BASE_PATH, {
    method: "POST",
    body,
  });

export const updateCoachProfile = (
  coachProfileId: string,
  body: SaveCoachProfileRequestDto
) =>
  apiClient<CoachProfileResponseDto>(`${COACH_PROFILES_BASE_PATH}/${coachProfileId}`, {
    method: "PUT",
    body,
  });

export const uploadCoachCertificate = (coachProfileId: string, body: FormData) =>
  apiClient<CoachCertificateResponseDto>(
    `${COACH_PROFILES_BASE_PATH}/${coachProfileId}/certificates`,
    {
      method: "POST",
      body,
    }
  );

export const deleteCoachCertificate = (
  coachProfileId: string,
  certificateId: string
) =>
  apiClient<void>(`${COACH_PROFILES_BASE_PATH}/${coachProfileId}/certificates/${certificateId}`, {
    method: "DELETE",
  });
