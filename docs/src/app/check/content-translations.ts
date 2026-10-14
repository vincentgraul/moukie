import { checkAgentTranslations } from "@/entities/agent/index.server";
import { checkSkillTranslations } from "@/entities/skill/index.server";
import { baseLocale, PUBLISHED_LOCALES } from "@/shared/i18n";

export function checkContentTranslations(pluginRoot: string): string[] {
	return PUBLISHED_LOCALES.filter((locale) => locale !== baseLocale).flatMap(
		(locale) => [
			...checkSkillTranslations(pluginRoot, locale),
			...checkAgentTranslations(pluginRoot, locale),
		],
	);
}
