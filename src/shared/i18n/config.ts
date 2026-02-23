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

export function getLocaleFromPathname(pathname: string): Locale | null {
  const firstSegment = pathname.split("/")[1]?.toLowerCase();
  if (!firstSegment) {
    return null;
  }

  if (firstSegment === "en" || firstSegment === "ko") {
    return firstSegment;
  }

  return null;
}

export function stripLocaleFromPathname(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  if (!locale) {
    return pathname || "/";
  }

  const stripped = pathname.slice(locale.length + 1);
  if (!stripped || stripped === "/") {
    return "/";
  }

  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}

export function localizePathname(pathname: string, locale: Locale): string {
  const barePath = stripLocaleFromPathname(pathname);
  return barePath === "/" ? `/${locale}` : `/${locale}${barePath}`;
}
