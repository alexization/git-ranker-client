export const SUPPORTED_LOCALES = ["en", "ko"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_STORAGE_KEY = "git-ranker.locale";

export function normalizeLocale(value: string | null | undefined): Locale {
  if (!value) {
    return DEFAULT_LOCALE;
  }

  const normalized = value.toLowerCase();
  if (normalized.startsWith("ko")) {
    return "ko";
  }

  return "en";
}
