import { apiClient } from "@/lib/api-client";
import type {
  CoachCertificateResponseDto,
  CoachProfileResponseDto,
  SaveCoachProfileRequestDto,
} from "./coach-profile.dto";

const COACH_PROFILES_BASE_PATH = "/api/coach-profiles";

const getMyCoachProfile = () =>
  apiClient<CoachProfileResponseDto>(`${COACH_PROFILES_BASE_PATH}/me`, {
    suppressErrorLog: true,
  });

const createCoachProfile = (body: SaveCoachProfileRequestDto) =>
  apiClient<CoachProfileResponseDto>(COACH_PROFILES_BASE_PATH, {
    method: "POST",
    body,
  });

const updateCoachProfile = (coachProfileId: string, body: SaveCoachProfileRequestDto) =>
  apiClient<CoachProfileResponseDto>(`${COACH_PROFILES_BASE_PATH}/${coachProfileId}`, {
    method: "PUT",
    body,
  });

const uploadCoachCertificate = (coachProfileId: string, body: FormData) =>
  apiClient<CoachCertificateResponseDto>(
    `${COACH_PROFILES_BASE_PATH}/${coachProfileId}/certificates`,
    {
      method: "POST",
      body,
    }
  );

const deleteCoachCertificate = (coachProfileId: string, certificateId: string) =>
  apiClient<void>(`${COACH_PROFILES_BASE_PATH}/${coachProfileId}/certificates/${certificateId}`, {
    method: "DELETE",
  });

export const useCoachProfileApi = () => {
  return {
    createCoachProfile,
    deleteCoachCertificate,
    getMyCoachProfile,
    updateCoachProfile,
    uploadCoachCertificate,
  };
};
