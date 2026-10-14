import { renderLucideIconMarkup } from "@/shared/lib/index.server";
import { type SkillCard, selectSkillCards } from "../model/skill-card";
import { readSkillFiles } from "./skill-files";

export type SkillCardView = SkillCard & { readonly iconMarkup: string };

export function readSkillCards(pluginRoot: string): SkillCard[] {
	return selectSkillCards(readSkillFiles(pluginRoot));
}

export function loadSkillCardViews(
	pluginRoot: string,
): Promise<SkillCardView[]> {
	return Promise.all(
		readSkillCards(pluginRoot).map(async (card) => ({
			...card,
			iconMarkup: await renderLucideIconMarkup(card.iconName),
		})),
	);
}
