import { useCallback, useState } from "react";
import { useAuth } from "@/features/auth/use-auth";
import { useRegisterApi } from "../api/register.api";
import { mapRegisterFormToRequestDto } from "../lib/register.mapper";
import type { RegisterFormData } from "../types/register.types";

export const useRegisterService = () => {
  const { register } = useRegisterApi();
  const { refreshAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerUser = useCallback(async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await register(mapRegisterFormToRequestDto(data));
      await refreshAuth();
      return Boolean(response);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshAuth, register]);

  return { loading, error, registerUser };
};
