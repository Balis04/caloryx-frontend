import { API_BASE_URL } from "@/lib/api-client";

import type { CoachCertificate } from "../types/coach-profile.types";

export function getCoachCertificateFileUrl(fileUrl: string | null | undefined) {
  if (!fileUrl) return null;

  if (/^https?:\/\//i.test(fileUrl)) {
    return fileUrl;
  }

  return `${API_BASE_URL}${fileUrl.startsWith("/") ? "" : "/"}${fileUrl}`;
}

export function openCoachCertificate(certificate: CoachCertificate) {
  const normalizedUrl = getCoachCertificateFileUrl(certificate.fileUrl);

  if (!normalizedUrl) return;

  window.open(normalizedUrl, "_blank", "noopener,noreferrer");
}
