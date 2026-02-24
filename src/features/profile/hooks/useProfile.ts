import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { fetchUserProfile } from "../services/profile.service";
import type { ProfileResponse } from "../types/profile.types";

export function useProfile() {
  const { getAccessTokenSilently } = useAuth0();

  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getAccessTokenSilently();
        const data = await fetchUserProfile(token);
        setProfile(data);
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [getAccessTokenSilently]);

  return { profile, loading, error };
}
