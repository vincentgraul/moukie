import { useLocation } from "@tanstack/react-router";
import { useCallback } from "react";
import { toSiteUrl } from "@/shared/config";
import type { PublishedLocale } from "@/shared/i18n";
import { toLanguageSwitchPath } from "./language-switch-path";

export function useSwitchLanguage(): (locale: PublishedLocale) => void {
	const pathname = useLocation({ select: (location) => location.pathname });
	return useCallback(
		(locale) => {
			window.location.assign(toSiteUrl(toLanguageSwitchPath(pathname, locale)));
		},
		[pathname],
	);
}
