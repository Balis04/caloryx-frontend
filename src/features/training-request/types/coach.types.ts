export interface CoachCardData {
  id: string;
  fullName: string;
  email: string;
  bio: string;
  contactNote?: string;
  specialties: string[];
  weeklyAvailability: string;
  availabilitySlots: string[];
  experienceLabel: string;
  certificates?: CoachCertificateData[];
}

export interface CoachCertificateData {
  id: string;
  certificateName: string;
  issuer: string;
  issuedAt: string;
  fileName: string;
  fileUrl: string;
}
