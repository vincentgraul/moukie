import { PUBLISHED_LOCALE_CODES } from "@/shared/config";
import { baseLocale, type Locale } from "./paraglide/runtime.js";

export type PublishedLocale = Extract<
	Locale,
	(typeof PUBLISHED_LOCALE_CODES)[number]
>;

export const PUBLISHED_LOCALES: readonly PublishedLocale[] =
	PUBLISHED_LOCALE_CODES;

const DEFAULT_LOCALE: PublishedLocale = baseLocale;

export function isPublishedLocale(value: unknown): value is PublishedLocale {
	return (PUBLISHED_LOCALES as readonly unknown[]).includes(value);
}

export function resolveLocale(value: unknown): PublishedLocale {
	return isPublishedLocale(value) ? value : DEFAULT_LOCALE;
}
