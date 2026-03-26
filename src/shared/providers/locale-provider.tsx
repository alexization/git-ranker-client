"use client";

import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  LOCALE_STORAGE_KEY,
  getLocaleFromPathname,
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

type LocaleProviderProps = {
  children: React.ReactNode;
  initialLocale: Locale;
};

export function LocaleProvider({ children, initialLocale }: LocaleProviderProps) {
  const pathname = usePathname();
  const [localeState, setLocaleState] = useState<Locale>(initialLocale);
  const pathLocale = getLocaleFromPathname(pathname);
  const locale = pathLocale ?? localeState;

  useEffect(() => {
    if (!pathLocale || pathLocale === localeState) {
      return;
    }

    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) {
        setLocaleState(pathLocale);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [pathLocale, localeState]);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.cookie = `${LOCALE_STORAGE_KEY}=${locale}; path=/; max-age=31536000; samesite=lax`;
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
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
