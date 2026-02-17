export const Goal = {
  CUT: "CUT",
  BULK: "BULK",
  MAINTAIN: "MAINTAIN",
} as const;

export type Goal = (typeof Goal)[keyof typeof Goal];

export const GoalConfig = {
  CUT: {
    label: "Fogyás",
    color: "text-red-400",
    icon: "🔥",
  },
  BULK: {
    label: "Tömegelés",
    color: "text-green-400",
    icon: "💪",
  },
  MAINTAIN: {
    label: "Szintentartás",
    color: "text-blue-400",
    icon: "⚖️",
  },
} as const;
