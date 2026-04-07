import { useCallback, useEffect, useState } from "react";
import { useCoachProfileApi } from "../api/coach-profile.api";
import {
  createEmptyCoachProfileState,
  mapCoachProfileQueryError,
  resolveCoachProfileQueryState,
  type CoachProfileQueryState,
} from "../lib/coach-profile.query";

export const useCoachProfileQuery = () => {
  const { getMyCoachProfile } = useCoachProfileApi();
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<CoachProfileQueryState>(createEmptyCoachProfileState());

  const loadCoachProfile = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getMyCoachProfile();
      setState(resolveCoachProfileQueryState(response));
    } catch (error) {
      setState(mapCoachProfileQueryError(error));
    } finally {
      setLoading(false);
    }
  }, [getMyCoachProfile]);

  useEffect(() => {
    void loadCoachProfile();
  }, [loadCoachProfile]);

  return {
    ...state,
    loading,
    reload: loadCoachProfile,
  };
};
