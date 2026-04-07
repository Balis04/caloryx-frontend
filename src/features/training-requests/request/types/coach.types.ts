export interface CoachCardData {
  id: string;
  fullName: string;
  email: string;
  bio: string;
  contactNote?: string;
  specialties: CoachSpecialtyData[];
  weeklyAvailability: string;
  availabilitySlots: string[];
  experienceLabel: string;
  certificates?: CoachCertificateData[];
}

export interface CoachSpecialtyData {
  label: string;
  value: string;
}

export interface CoachCertificateData {
  id: string;
  certificateName: string;
  issuer: string;
  issuedAt: string;
  fileName: string;
  fileUrl: string;
}
