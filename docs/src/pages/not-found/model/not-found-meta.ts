import { formatDocumentTitle } from "@/shared/config";
import { m, type PublishedLocale } from "@/shared/i18n";

export function createNotFoundMeta(locale: PublishedLocale) {
	return [
		{ title: formatDocumentTitle(m.not_found_title({}, { locale })) },
		{ name: "robots", content: "noindex" },
	];
}
