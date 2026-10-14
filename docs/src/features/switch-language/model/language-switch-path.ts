import { isSitePage, type SitePage, toPagePath } from "@/shared/config";
import { isPublishedLocale, type PublishedLocale } from "@/shared/i18n";

function findCurrentPage(pathname: string): SitePage | undefined {
	const segments = pathname.split("/").filter(Boolean);
	const localeIndex = segments.findIndex(isPublishedLocale);
	if (localeIndex === -1) {
		return undefined;
	}
	const page = segments[localeIndex + 1];
	return page !== undefined && isSitePage(page) ? page : undefined;
}

export function toLanguageSwitchPath(
	pathname: string,
	locale: PublishedLocale,
): string {
	return toPagePath(locale, findCurrentPage(pathname));
}
