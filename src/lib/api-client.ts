const DEFAULT_API_URL = "http://localhost:8080";

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL?.trim() || DEFAULT_API_URL).replace(/\/+$/, "");

const XSRF_COOKIE_NAME = "XSRF-TOKEN";
const CSRF_HEADER_NAME = "X-XSRF-TOKEN";
const CSRF_ENDPOINT = "/api/auth/csrf";
const STATE_CHANGING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const DEFAULT_CSRF_PARAMETER_NAME = "_csrf";

let csrfRequest: Promise<string | null> | null = null;
let csrfParameterName = DEFAULT_CSRF_PARAMETER_NAME;

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
  suppressErrorLog?: boolean;
  skipCsrf?: boolean;
}

const buildApiUrl = (endpoint: string) =>
  endpoint.startsWith("http://") || endpoint.startsWith("https://")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

const getCookieValue = (name: string) => {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.slice(name.length + 1));
};

const readCsrfToken = () => getCookieValue(XSRF_COOKIE_NAME);

const ensureCsrfToken = async () => {
  const existingToken = readCsrfToken();
  if (existingToken) {
    return existingToken;
  }

  if (!csrfRequest) {
    csrfRequest = fetch(buildApiUrl(CSRF_ENDPOINT), {
      credentials: "include",
      method: "GET",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new ApiError(
            `Hiba: ${response.status} ${response.statusText}`,
            response.status
          );
        }

        const cookieToken = readCsrfToken();
        if (cookieToken) {
          return cookieToken;
        }

        const contentType = response.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
          const data = (await response.json().catch(() => null)) as
            | { csrfToken?: string | null; token?: string | null; parameterName?: string | null }
            | null;

          if (typeof data?.parameterName === "string" && data.parameterName.trim()) {
            csrfParameterName = data.parameterName;
          }

          return data?.csrfToken ?? data?.token ?? null;
        }

        return null;
      })
      .finally(() => {
        csrfRequest = null;
      });
  }

  return csrfRequest;
};

export const getCsrfFormState = async () => {
  const token = (await ensureCsrfToken()) ?? readCsrfToken();

  return {
    parameterName: csrfParameterName,
    token,
  };
};

export const apiClient = async <T>(
  endpoint: string,
  { body, suppressErrorLog, skipCsrf, ...customConfig }: ApiConfig = {}
): Promise<T> => {
  const isFormData = body instanceof FormData;
  const method = (customConfig.method || (body ? "POST" : "GET")).toUpperCase();
  const headers = new Headers(customConfig.headers);

  if (!isFormData && body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!skipCsrf && STATE_CHANGING_METHODS.has(method)) {
    const csrfToken = (await ensureCsrfToken()) ?? readCsrfToken();

    if (csrfToken) {
      headers.set(CSRF_HEADER_NAME, csrfToken);
    }
  }

  const config: RequestInit = {
    ...customConfig,
    method,
    credentials: "include",
    headers,
  };

  if (body !== undefined) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(buildApiUrl(endpoint), config);
    const contentType = response.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? await response.json().catch(() => null) : null;

    if (!response.ok) {
      const errorMessage =
        data?.message || `Hiba: ${response.status} ${response.statusText}`;
      throw new ApiError(errorMessage, response.status);
    }

    if (response.status === 204 || data == null) {
      return {} as T;
    }

    return data as T;
  } catch (error) {
    if (!suppressErrorLog) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("API error:", errorMessage);
    }

    throw error;
  }
};

export { buildApiUrl, readCsrfToken };
