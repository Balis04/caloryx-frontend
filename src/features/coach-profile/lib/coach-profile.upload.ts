import type { PendingCoachCertificateUpload } from "../model/coach-profile.types";

export const createCoachCertificateUploadFormData = (
  certificate: PendingCoachCertificateUpload
) => {
  const formData = new FormData();

  formData.append("file", certificate.file);
  formData.append("certificateName", certificate.certificateName.trim());
  formData.append("issuer", certificate.issuer.trim());
  formData.append(
    "issuedAt",
    new Date(`${certificate.issuedAt}T00:00:00.000Z`).toISOString()
  );

  return formData;
};
