import type { CoachProfileListResponseDto } from "../types/coach-directory.dto";

const dayLabels: Record<string, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

export const formatAvailability = (
  availabilities?: CoachProfileListResponseDto["availabilities"]
) => {
  const activeAvailabilities = availabilities?.filter((slot) => slot.available) ?? [];

  if (activeAvailabilities.length === 0) {
    return {
      summary: "By arrangement",
      slots: ["Time by arrangement"],
    };
  }

  const slots = activeAvailabilities.map((slot) => {
    const day = slot.dayOfWeek ? dayLabels[slot.dayOfWeek] ?? slot.dayOfWeek : "Unknown day";
    const timeRange =
      slot.startTime && slot.endTime ? `${slot.startTime}-${slot.endTime}` : "flexible time";

    return `${day} ${timeRange}`;
  });

  return {
    summary: slots.join(", "),
    slots,
  };
};

export const formatExperience = (trainingStartedAt?: string | null) => {
  if (!trainingStartedAt) {
    return "Experience not provided";
  }

  const startedYear = new Date(trainingStartedAt).getFullYear();
  const currentYear = new Date().getFullYear();

  if (Number.isNaN(startedYear)) {
    return "Experience not provided";
  }

  const years = Math.max(currentYear - startedYear, 0);
  return years === 0 ? "Less than 1 year of experience" : `${years} years of experience`;
};
