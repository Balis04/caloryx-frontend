export interface CoachProfileListResponseDto {
  id?: string;
  userId?: string;
  coachName?: string | null;
  shortDescription?: string | null;
  trainingStartedAt?: string | null;
  trainingFormat?: string | null;
  maxCapacity?: number | null;
  currency?: string | null;
  priceFrom?: number | null;
  priceTo?: number | null;
  contactNote?: string | null;
  email?: string | null;
  certificates?: Array<{
    id?: string | null;
    certificateName?: string | null;
    issuer?: string | null;
    issuedAt?: string | null;
    fileName?: string | null;
    fileUrl?: string | null;
  }>;
  availabilities?: Array<{
    dayOfWeek?: string;
    available?: boolean;
    startTime?: string | null;
    endTime?: string | null;
  }>;
}
