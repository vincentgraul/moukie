import {
	PUBLISHED_LOCALE_CODES,
	type SitePage,
	toAbsoluteUrl,
	toPagePath,
} from "@/shared/config";
import { baseLocale, type PublishedLocale } from "@/shared/i18n";

const OPEN_GRAPH_LOCALES: Readonly<Record<PublishedLocale, string>> = {
	fr: "fr_FR",
	en: "en_US",
};

export type PageHeadInput = {
	readonly locale: PublishedLocale;
	readonly page?: SitePage;
	readonly title: string;
	readonly description: string;
};

export function createCanonicalLink(locale: PublishedLocale, page?: SitePage) {
	return {
		rel: "canonical",
		href: toAbsoluteUrl(toPagePath(locale, page)),
	};
}

export function createPageHead({
	locale,
	page,
	title,
	description,
}: PageHeadInput) {
	const canonical = createCanonicalLink(locale, page);

	return {
		meta: [
			{ title },
			{ name: "description", content: description },
			{ property: "og:title", content: title },
			{ property: "og:description", content: description },
			{ property: "og:url", content: canonical.href },
			{ property: "og:type", content: "website" },
			{ property: "og:locale", content: OPEN_GRAPH_LOCALES[locale] },
		],
		links: [
			canonical,
			...PUBLISHED_LOCALE_CODES.map((code) => ({
				rel: "alternate",
				hreflang: code,
				href: toAbsoluteUrl(toPagePath(code, page)),
			})),
			{
				rel: "alternate",
				hreflang: "x-default",
				href: toAbsoluteUrl(toPagePath(baseLocale, page)),
			},
		],
	};
}
