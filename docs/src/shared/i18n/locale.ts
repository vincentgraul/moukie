import { PUBLISHED_LOCALE_CODES } from "@/shared/config";
import { baseLocale, type Locale } from "./paraglide/runtime.js";

export const PUBLISHED_LOCALES: readonly Locale[] = PUBLISHED_LOCALE_CODES;

export function isPublishedLocale(value: unknown): value is Locale {
	return (PUBLISHED_LOCALES as readonly unknown[]).includes(value);
}

export function resolveLocale(value: unknown): Locale {
	return isPublishedLocale(value) ? value : baseLocale;
}
