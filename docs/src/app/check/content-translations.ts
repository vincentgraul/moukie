import {
	AGENT_SOURCE,
	checkPluginItemTranslations,
	SKILL_SOURCE,
} from "@/entities/plugin-item/index.server";
import { baseLocale, PUBLISHED_LOCALES } from "@/shared/i18n";

export function checkContentTranslations(pluginRoot: string): string[] {
	return PUBLISHED_LOCALES.filter((locale) => locale !== baseLocale).flatMap(
		(locale) => [
			...checkPluginItemTranslations(pluginRoot, SKILL_SOURCE, locale),
			...checkPluginItemTranslations(pluginRoot, AGENT_SOURCE, locale),
		],
	);
}
