export const PUBLISHED_LOCALE_CODES = ["fr"] as const;

export const SITE_PAGES = ["skills", "agents"] as const;

export type SitePage = (typeof SITE_PAGES)[number];

export function isSitePage(page: string): page is SitePage {
	return (SITE_PAGES as readonly string[]).includes(page);
}

export function toPagePath(locale: string, page?: SitePage): string {
	return page === undefined ? `/${locale}/` : `/${locale}/${page}/`;
}
