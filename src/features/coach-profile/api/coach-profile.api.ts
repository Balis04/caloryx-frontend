import { useApi } from "@/hooks/useApi";
import { useCallback } from "react";
import type {
  CoachCertificateResponseDto,
  CoachProfileResponseDto,
  SaveCoachProfileRequestDto,
} from "./coach-profile.dto";

const COACH_PROFILES_BASE_PATH = "/api/coach-profiles";

export const useCoachProfileApi = () => {
  const { request } = useApi();

  const getMyCoachProfile = useCallback(
    () =>
      request<CoachProfileResponseDto>(`${COACH_PROFILES_BASE_PATH}/me`, {
        suppressErrorLog: true,
      }),
    [request]
  );

  const createCoachProfile = useCallback(
    (body: SaveCoachProfileRequestDto) =>
      request<CoachProfileResponseDto>(COACH_PROFILES_BASE_PATH, {
        method: "POST",
        body,
      }),
    [request]
  );

  const updateCoachProfile = useCallback(
    (coachProfileId: string, body: SaveCoachProfileRequestDto) =>
      request<CoachProfileResponseDto>(`${COACH_PROFILES_BASE_PATH}/${coachProfileId}`, {
        method: "PUT",
        body,
      }),
    [request]
  );

  const uploadCoachCertificate = useCallback(
    (coachProfileId: string, body: FormData) =>
      request<CoachCertificateResponseDto>(
        `${COACH_PROFILES_BASE_PATH}/${coachProfileId}/certificates`,
        {
          method: "POST",
          body,
        }
      ),
    [request]
  );

  const deleteCoachCertificate = useCallback(
    (coachProfileId: string, certificateId: string) =>
      request<void>(`${COACH_PROFILES_BASE_PATH}/${coachProfileId}/certificates/${certificateId}`, {
        method: "DELETE",
      }),
    [request]
  );

  return {
    createCoachProfile,
    deleteCoachCertificate,
    getMyCoachProfile,
    updateCoachProfile,
    uploadCoachCertificate,
  };
};
