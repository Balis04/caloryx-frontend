import type {
  AvailabilitySlot,
  CoachProfileFormData,
} from "./coach-profile.types";

export const initialAvailability = (): AvailabilitySlot[] => [
  {
    dayOfWeek: "MONDAY",
    label: "Monday",
    enabled: true,
    from: "08:00",
    until: "16:00",
  },
  {
    dayOfWeek: "TUESDAY",
    label: "Tuesday",
    enabled: true,
    from: "08:00",
    until: "16:00",
  },
  {
    dayOfWeek: "WEDNESDAY",
    label: "Wednesday",
    enabled: true,
    from: "08:00",
    until: "16:00",
  },
  {
    dayOfWeek: "THURSDAY",
    label: "Thursday",
    enabled: true,
    from: "08:00",
    until: "16:00",
  },
  {
    dayOfWeek: "FRIDAY",
    label: "Friday",
    enabled: true,
    from: "08:00",
    until: "14:00",
  },
  {
    dayOfWeek: "SATURDAY",
    label: "Saturday",
    enabled: false,
    from: "09:00",
    until: "12:00",
  },
  {
    dayOfWeek: "SUNDAY",
    label: "Sunday",
    enabled: false,
    from: "09:00",
    until: "12:00",
  },
];

export const initialCoachProfileFormData: CoachProfileFormData = {
  description: "",
  startedCoachingAt: "",
  maxCapacity: "",
  sessionFormat: "",
  priceFrom: "",
  priceTo: "",
  currency: "HUF",
  contactNote: "",
  certificates: [],
  availability: initialAvailability(),
};
