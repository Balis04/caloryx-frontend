import { useCallback, useEffect, useState } from "react";
import { useProfileApi } from "../api/profile.api";
import type { ProfileResponseDto } from "../model/profile.types";

export const useProfileQuery = (enabled = true) => {
  const { getProfile } = useProfileApi();
  const [profile, setProfile] = useState<ProfileResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getProfile();
      setProfile(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ismeretlen hiba";
      setError(message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [getProfile]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      setProfile(null);
      return;
    }

    void loadProfile();
  }, [enabled, loadProfile]);

  return { profile, loading, error, reload: loadProfile };
};
