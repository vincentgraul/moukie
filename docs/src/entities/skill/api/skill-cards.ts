import {
	loadPluginCardViews,
	type PluginCardView,
	readPluginCards,
} from "@/shared/api/index.server";
import type { PublishedLocale } from "@/shared/i18n";
import type { SkillCard } from "../model/skill-card";
import type { SkillBadge } from "../model/skill-metadata";
import { SKILL_SOURCE } from "./skill-files";

export type SkillCardView = PluginCardView<SkillBadge>;

export function readSkillCards(
	pluginRoot: string,
	locale: PublishedLocale,
): SkillCard[] {
	return readPluginCards(pluginRoot, SKILL_SOURCE, locale);
}

export function loadSkillCardViews(
	pluginRoot: string,
	locale: PublishedLocale,
): Promise<SkillCardView[]> {
	return loadPluginCardViews(pluginRoot, SKILL_SOURCE, locale);
}
