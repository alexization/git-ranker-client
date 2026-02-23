export const enMessages = {
  "common.retry": "Retry",
  "common.cancel": "Cancel",
  "common.confirm": "Confirm",
  "common.loading": "Loading...",
  "common.error": "Something went wrong.",
  "common.login": "Sign in",
  "common.logout": "Log out",
  "common.profile": "My profile",
  "common.settings": "Settings",
  "home.search.placeholder": "Search GitHub users...",
  "home.search.submit": "Search",
  "error.401": "Authentication is required.",
  "error.403": "You do not have permission.",
  "error.404": "The requested resource could not be found.",
  "error.429": "Too many requests. Please try again later.",
  "error.500": "A server error occurred.",
} as const;

export type MessageKey = keyof typeof enMessages;
