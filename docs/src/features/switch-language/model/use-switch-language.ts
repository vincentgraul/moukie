import { useLocation } from "@tanstack/react-router";
import { useCallback } from "react";
import { toSiteUrl } from "@/shared/config";
import type { PublishedLocale } from "@/shared/i18n";
import {
	type LanguageSwitchDestination,
	toLanguageSwitchPath,
} from "./language-switch-path";

export function useSwitchLanguage(
	destination: LanguageSwitchDestination = "same-page",
): (locale: PublishedLocale) => void {
	const pathname = useLocation({ select: (location) => location.pathname });
	return useCallback(
		(locale) => {
			window.location.assign(
				toSiteUrl(toLanguageSwitchPath(pathname, locale, destination)),
			);
		},
		[pathname, destination],
	);
}
