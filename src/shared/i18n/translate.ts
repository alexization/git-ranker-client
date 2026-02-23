import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  normalizeLocale,
  type Locale,
} from "@/shared/i18n/config";
import { getMessages, type MessageKey } from "@/shared/i18n/messages";

type TranslationValues = Record<string, number | string>;

function interpolate(template: string, values?: TranslationValues): string {
  if (!values) {
    return template;
  }

  return Object.entries(values).reduce((result, [key, value]) => {
    return result.replaceAll(`{${key}}`, String(value));
  }, template);
}

export function getCurrentLocale(): Locale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (savedLocale) {
    return normalizeLocale(savedLocale);
  }

  return normalizeLocale(window.navigator.language);
}

export function translate(key: MessageKey, values?: TranslationValues): string {
  const locale = getCurrentLocale();
  const messages = getMessages(locale);
  const template = messages[key] ?? key;

  return interpolate(template, values);
}
