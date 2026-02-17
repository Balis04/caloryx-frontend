export function getValidToken(): string | null {
  const token = localStorage.getItem("token");
  const exp = localStorage.getItem("token_expires_at");

  if (!token || !exp) return null;

  const expiresAt = Number(exp);

  if (Number.isNaN(expiresAt) || Date.now() >= expiresAt) {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expires_at");
    return null;
  }

  return token;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("token_expires_at");
}
