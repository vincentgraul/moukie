export const PUBLISHED_LOCALE_CODES = ["fr", "en"] as const;

export const SITE_PAGES = ["getting-started", "skills", "agents"] as const;

export type SitePage = (typeof SITE_PAGES)[number];

export function listPagePaths(): string[] {
	return PUBLISHED_LOCALE_CODES.flatMap((locale) => [
		toPagePath(locale),
		...SITE_PAGES.map((page) => toPagePath(locale, page)),
	]);
}

export function isSitePage(page: string): page is SitePage {
	return (SITE_PAGES as readonly string[]).includes(page);
}

export function toPagePath(locale: string, page?: SitePage): string {
	return page === undefined ? `/${locale}/` : `/${locale}/${page}/`;
}
