import { cookies, headers } from "next/headers";

import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  normalizeLocale,
  type Locale,
} from "@/shared/i18n/config";

export async function getRequestLocale(): Promise<Locale> {
  const headerStore = await headers();
  const localeFromPathHeader = headerStore.get("x-locale");
  if (localeFromPathHeader) {
    return normalizeLocale(localeFromPathHeader);
  }

  const cookieStore = await cookies();
  const localeFromCookie = cookieStore.get(LOCALE_STORAGE_KEY)?.value;
  if (localeFromCookie) {
    return normalizeLocale(localeFromCookie);
  }

  const localeFromHeader = headerStore.get("accept-language");
  if (localeFromHeader) {
    return normalizeLocale(localeFromHeader);
  }

  return DEFAULT_LOCALE;
}
