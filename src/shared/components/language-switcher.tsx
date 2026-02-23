"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronDown, Languages } from "lucide-react";

import { Button } from "@/shared/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/dropdown-menu";
import { localizePathname, type Locale } from "@/shared/i18n/config";
import { useI18n } from "@/shared/providers/locale-provider";

const localeOptions: Array<{ value: Locale; labelKey: "language.switcher.en" | "language.switcher.ko" }> = [
  { value: "en", labelKey: "language.switcher.en" },
  { value: "ko", labelKey: "language.switcher.ko" },
];

export function LanguageSwitcher() {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSelectLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) {
      return;
    }

    const nextPath = localizePathname(pathname, nextLocale);
    const nextQuery = searchParams.toString();
    router.push(nextQuery ? `${nextPath}?${nextQuery}` : nextPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 min-w-[56px] gap-1.5 px-2 sm:min-w-[84px] sm:px-3"
          aria-label={t("language.switcher.aria")}
        >
          <Languages className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase">{locale}</span>
          <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-40">
        {localeOptions.map((option) => {
          const selected = locale === option.value;

          return (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => handleSelectLocale(option.value)}
              className="justify-between"
            >
              <span>{t(option.labelKey)}</span>
              {selected ? <Check className="h-4 w-4 text-primary" /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
