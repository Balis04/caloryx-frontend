const API_BASE_URL = "http://localhost:8080";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export interface ApiConfig extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string;
  suppressErrorLog?: boolean;
}

export const apiClient = async <T>(
  endpoint: string,
  { body, token, suppressErrorLog, ...customConfig }: ApiConfig = {}
): Promise<T> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...((customConfig.headers as Record<string, string>) || {}),
  };

  const config: RequestInit = {
    method: customConfig.method || (body ? "POST" : "GET"),
    ...customConfig,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const errorMessage =
      data?.message || `Hiba: ${response.status} ${response.statusText}`;
    throw new ApiError(errorMessage, response.status);
  }

  if (response.status === 204 || !data) {
    return {} as T;
  }

  return data as T;
};
