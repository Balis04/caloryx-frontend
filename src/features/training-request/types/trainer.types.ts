export interface TrainerCardData {
  id: string;
  fullName: string;
  email: string;
  bio: string;
  contactNote?: string;
  specialties: string[];
  weeklyAvailability: string;
  availabilitySlots: string[];
  experienceLabel: string;
  certificates?: TrainerCertificateData[];
}

export interface TrainerCertificateData {
  id: string;
  certificateName: string;
  issuer: string;
  issuedAt: string;
  fileName: string;
  fileUrl: string;
}
