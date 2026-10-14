import { useParams } from "@tanstack/react-router";
import { resolveLocale } from "./locale";
import type { Locale } from "./paraglide/runtime.js";

export function useLocale(): Locale {
	const { locale } = useParams({ strict: false });
	return resolveLocale(locale);
}
