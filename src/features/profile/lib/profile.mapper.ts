import type {
  ProfileResponseDto,
  UpdateProfileRequestDto,
} from "../api/profile.dto";
import {
  initialProfileFormValues,
  type ProfileFormValues,
} from "../model/profile.form";
import type { Profile } from "../model/profile.model";

export const mapProfileDtoToModel = (dto: ProfileResponseDto): Profile => ({
  ...dto,
});

export const mapProfileToFormValues = (
  profile: Profile | null | undefined
): ProfileFormValues => {
  if (!profile) {
    return initialProfileFormValues;
  }

  return {
    ...profile,
    birthDate: profile.birthDate ? profile.birthDate.split("T")[0] : "",
    heightCm: String(profile.heightCm ?? ""),
    startWeightKg: String(profile.startWeightKg ?? ""),
    actualWeightKg: String(profile.actualWeightKg ?? ""),
    targetWeightKg: String(profile.targetWeightKg ?? ""),
    weeklyGoalKg: String(profile.weeklyGoalKg ?? ""),
    userRole: profile.role,
  };
};

export const mapProfileFormValuesToUpdateRequest = (
  values: ProfileFormValues
): UpdateProfileRequestDto => ({
  ...values,
  role: values.userRole,
  heightCm: Number(values.heightCm),
  startWeightKg: Number(values.startWeightKg),
  actualWeightKg: Number(values.actualWeightKg),
  targetWeightKg: Number(values.targetWeightKg),
  weeklyGoalKg: Number(values.weeklyGoalKg),
});
