import { getValidToken, logout } from "./auth";

export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = getValidToken();

  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    logout();
    window.location.href = "/";
  }

  return response;
}
