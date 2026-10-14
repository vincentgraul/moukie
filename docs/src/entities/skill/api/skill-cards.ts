import { addIconMarkup, type PluginCardView } from "@/shared/api/index.server";
import { type SkillCard, selectSkillCards } from "../model/skill-card";
import type { SkillBadge } from "../model/skill-metadata";
import { readSkillFiles } from "./skill-files";

export type SkillCardView = PluginCardView<SkillBadge>;

export function readSkillCards(pluginRoot: string): SkillCard[] {
	return selectSkillCards(readSkillFiles(pluginRoot));
}

export function loadSkillCardViews(
	pluginRoot: string,
): Promise<SkillCardView[]> {
	return addIconMarkup(readSkillCards(pluginRoot));
}
