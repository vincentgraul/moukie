import { formatDocumentTitle, SITE_NAME } from "@/shared/config";
import { baseLocale, m } from "@/shared/i18n";

export function createRootTitleMeta(isNotFound: boolean) {
	return [
		{
			title: isNotFound
				? formatDocumentTitle(m.not_found_title({}, { locale: baseLocale }))
				: SITE_NAME,
		},
	];
}
