import { useCallback, useEffect, useState } from "react";
import type { ProfileResponse } from "../types/profile.types";
import { useProfileService } from "./useProfileService";

export const useViewerProfile = (enabled = true) => {
  const { getProfile } = useProfileService();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
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

    loadProfile();
  }, [enabled, loadProfile]);

  return { profile, loading, error, reload: loadProfile };
};
