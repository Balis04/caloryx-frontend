// src/lib/api-client.ts
const API_BASE_URL = "http://localhost:8080";

/** * Meghatározzuk, pontosan milyen típusú adatokat fogadhat a body.
 * Az 'unknown' azért jó itt, mert a JSON.stringify szinte mindennel megbirkózik,
 * de nem engedi, hogy "bármit" csináljunk az objektummal validáció nélkül.
 */
export interface ApiConfig extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string;
}

export const apiClient = async <T>(
  endpoint: string,
  { body, token, ...customConfig }: ApiConfig = {}
): Promise<T> => {
  // A fejléc összeállítása típusbiztosan
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

  // 1. Ellenőrizzük a Content-Type-ot, hogy tényleg JSON jött-e
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  // 2. Biztonságos parse-olás
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    // Ha van hibaüzenet a JSON-ben, azt dobjuk, egyébként a státuszkódot
    const errorMessage =
      data?.message || `Hiba: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  // 3. Kezeljük az üres válaszokat (pl. 204 No Content)
  if (response.status === 204 || !data) {
    return {} as T;
  }

  return data as T;
};
