export const SITE_NAME = "Moukie";

export const REPOSITORY_URL = "https://github.com/vincentgraul/moukie";

const BASE_PATH = import.meta.env.BASE_URL;

export function toSiteUrl(path: string): string {
	return `${BASE_PATH.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export function formatDocumentTitle(pageTitle: string): string {
	return `${pageTitle} · ${SITE_NAME}`;
}
