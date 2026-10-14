import { createServerFn } from "@tanstack/react-start";
import { findPluginRoot } from "@/shared/api/index.server";
import { type PublishedLocale, parsePublishedLocale } from "@/shared/i18n";
import { loadSkillCardViews } from "./skill-cards";

export const getSkillCards = createServerFn({ method: "GET" })
	.validator((locale: PublishedLocale) => parsePublishedLocale(locale))
	.handler(({ data: locale }) => loadSkillCardViews(findPluginRoot(), locale));
