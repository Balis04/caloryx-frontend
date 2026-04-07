export const COACH_REQUEST_PAGE_COPY = {
  badge: "Training request",
  title: "Choose a coach first, then send a focused training request.",
  description:
    "Browse available coaches, review their background, then open a dedicated request form with your preferences and goals already centered around the selected coach.",
  chips: ["Coach selection", "Goal-based request", "Certificates and availability"],
} as const;

export const TRAINING_REQUEST_FORM_PAGE_COPY = {
  badge: "Training request form",
  title: "Send a clear request so your coach can build the right plan faster.",
  description:
    "Fill in your current stats, goal, activity level, and training preferences. The more focused your request is, the easier it is for the coach to respond with something useful.",
  chips: ["Profile-based fields", "Training preferences", "Coach-linked request"],
  backButtonLabel: "Back to coach selection",
} as const;
