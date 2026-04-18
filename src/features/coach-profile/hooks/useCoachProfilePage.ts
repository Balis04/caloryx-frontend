import { useEffect, useMemo, useState } from "react";
import { getMyCoachProfile } from "../api/coach-profile.api";
import {
  formatPriceRange,
  getTrainingFormatLabel,
} from "../lib/coach-profile.formatters";
import {
  createEmptyCoachProfileState,
  mapCoachProfileErrorToState,
  mapCoachProfileResponseToState,
  type CoachProfileLoadState,
} from "../lib/coach-profile.state";

export const useCoachProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<CoachProfileLoadState>(
    createEmptyCoachProfileState()
  );

  useEffect(() => {
    const loadCoachProfile = async () => {
      setLoading(true);

      try {
        const response = await getMyCoachProfile();
        setState(mapCoachProfileResponseToState(response));
      } catch (error) {
        setState(mapCoachProfileErrorToState(error));
      } finally {
        setLoading(false);
      }
    };

    void loadCoachProfile();
  }, []);

  const viewModel = useMemo(() => {
    const downloadableCertificates = state.formData.certificates.filter(
      (certificate) => certificate.fileUrl
    );
    const activeAvailability = state.formData.availability
      .filter((slot) => slot.enabled)
      .map((slot) => `${slot.label} ${slot.from}-${slot.until}`);
    const trainingFormatLabel = getTrainingFormatLabel(
      state.formData.sessionFormat
    );
    const priceRange = formatPriceRange(
      state.formData.priceFrom,
      state.formData.priceTo,
      state.formData.currency
    );

    return {
      activeAvailability,
      downloadableCertificates,
      priceRange,
      trainingFormatLabel,
    };
  }, [state.formData]);

  return {
    ...state,
    loading,
    ...viewModel,
  };
};
