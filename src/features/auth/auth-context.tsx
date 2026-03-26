import { apiClient, ApiError, buildApiUrl } from "@/lib/api-client";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AuthContext } from "./auth-context.shared";
import type { AuthMeResponse, LogoutResponse } from "./auth.types";

export interface AuthContextValue {
  authState: AuthMeResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: (publicPath?: string) => Promise<void>;
  refreshAuth: () => Promise<AuthMeResponse | null>;
  clearAuth: () => void;
  hasAnyRole: (requiredRoles: string | string[]) => boolean;
}

const normalizeAuthState = (
  payload: Partial<AuthMeResponse> | null | undefined
): AuthMeResponse => ({
  authenticated: payload?.authenticated === true,
  userId: payload?.userId ?? null,
  auth0Id: payload?.auth0Id ?? null,
  email: payload?.email ?? null,
  emailVerified: payload?.emailVerified ?? false,
  fullName: payload?.fullName ?? null,
  role: payload?.role ?? null,
  roles: Array.isArray(payload?.roles)
    ? payload.roles.filter((role): role is string => typeof role === "string")
    : payload?.role
      ? [payload.role]
      : [],
  hasProfile: payload?.hasProfile ?? false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuth = useCallback(() => {
    setAuthState(null);
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      const response = await apiClient<AuthMeResponse>("/api/auth/me", {
        suppressErrorLog: true,
      });
      const nextState = normalizeAuthState(response);

      if (!nextState.authenticated) {
        setAuthState(null);
        return null;
      }

      setAuthState(nextState);
      return nextState;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setAuthState(null);
        return null;
      }

      throw error;
    }
  }, []);

  useEffect(() => {
    let active = true;

    const loadAuth = async () => {
      setIsLoading(true);

      try {
        const response = await apiClient<AuthMeResponse>("/api/auth/me", {
          suppressErrorLog: true,
        });

        if (!active) {
          return;
        }

        const nextState = normalizeAuthState(response);
        setAuthState(nextState.authenticated ? nextState : null);
      } catch (error) {
        if (!active) {
          return;
        }

        if (!(error instanceof ApiError && error.status === 401)) {
          console.error("Failed to load auth state:", error);
        }

        setAuthState(null);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadAuth();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(() => {
    window.location.assign(buildApiUrl("/api/auth/login"));
  }, []);

  const logout = useCallback(async (publicPath = "/") => {
    try {
      const response = await apiClient<LogoutResponse>("/api/auth/logout", {
        method: "POST",
        suppressErrorLog: true,
      });

      setAuthState(null);

      if (response?.auth0LogoutUrl) {
        window.location.assign(response.auth0LogoutUrl);
        return;
      }
    } catch (error) {
      setAuthState(null);
      console.error("Logout failed:", error);
    }

    window.location.assign(publicPath);
  }, []);

  const hasAnyRole = useCallback(
    (requiredRoles: string | string[]) => {
      if (!authState) {
        return false;
      }

      const required = Array.isArray(requiredRoles)
        ? requiredRoles
        : [requiredRoles];

      return required.some((role) => authState.roles.includes(role));
    },
    [authState]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      authState,
      isAuthenticated: authState?.authenticated === true,
      isLoading,
      login,
      logout,
      refreshAuth,
      clearAuth,
      hasAnyRole,
    }),
    [authState, clearAuth, hasAnyRole, isLoading, login, logout, refreshAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
