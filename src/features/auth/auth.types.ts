export interface AuthMeResponse {
  authenticated: boolean;
  userId: string | null;
  auth0Id: string | null;
  email: string | null;
  emailVerified: boolean;
  fullName: string | null;
  role: string | null;
  hasProfile: boolean;
}

export interface LogoutResponse {
  auth0LogoutUrl?: string | null;
}
