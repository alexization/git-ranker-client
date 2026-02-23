import { DEFAULT_LOCALE, type Locale } from "@/shared/i18n/config";
import { enMessages, type MessageKey } from "@/shared/i18n/messages/en";
import { koMessages } from "@/shared/i18n/messages/ko";

export type Messages = Readonly<Record<MessageKey, string>>;

const messageMap: Record<Locale, Messages> = {
  en: enMessages,
  ko: koMessages,
};

export function getMessages(locale: Locale): Messages {
  return messageMap[locale] ?? messageMap[DEFAULT_LOCALE];
}

export type { MessageKey };
