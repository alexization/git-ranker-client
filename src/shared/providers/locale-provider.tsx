"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  normalizeLocale,
  type Locale,
} from "@/shared/i18n/config";
import { getMessages, type MessageKey, type Messages } from "@/shared/i18n/messages";

type TranslationValues = Record<string, number | string>;

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Messages;
  t: (key: MessageKey, values?: TranslationValues) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function interpolate(template: string, values?: TranslationValues): string {
  if (!values) {
    return template;
  }

  return Object.entries(values).reduce((result, [key, value]) => {
    return result.replaceAll(`{${key}}`, String(value));
  }, template);
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    const initialLocale = savedLocale
      ? normalizeLocale(savedLocale)
      : normalizeLocale(navigator.language);

    setLocaleState(initialLocale);
    document.documentElement.lang = initialLocale;
  }, []);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    document.documentElement.lang = nextLocale;
  }, []);

  const messages = useMemo(() => getMessages(locale), [locale]);
  const t = useCallback(
    (key: MessageKey, values?: TranslationValues) => {
      const template = messages[key] ?? key;
      return interpolate(template, values);
    },
    [messages],
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      messages,
      t,
    }),
    [locale, setLocale, messages, t],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useI18n must be used within LocaleProvider");
  }

  return context;
}
