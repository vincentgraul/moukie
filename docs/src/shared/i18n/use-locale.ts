import { useParams } from "@tanstack/react-router";
import { type PublishedLocale, resolveLocale } from "./locale";

export function useLocale(): PublishedLocale {
	const { locale } = useParams({ strict: false });
	return resolveLocale(locale);
}
