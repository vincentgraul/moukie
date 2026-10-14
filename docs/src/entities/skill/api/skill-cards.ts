import { type IconShape, loadLucideIconShape } from "@/shared/lib";
import { type SkillCard, selectSkillCards } from "../model/skill-card";
import { readSkillFiles } from "./skill-files";

export type SkillCardView = SkillCard & { readonly iconShape: IconShape };

export function readSkillCards(pluginRoot: string): SkillCard[] {
	return selectSkillCards(readSkillFiles(pluginRoot));
}

export function loadSkillCardViews(
	pluginRoot: string,
): Promise<SkillCardView[]> {
	return Promise.all(
		readSkillCards(pluginRoot).map(async (card) => ({
			...card,
			iconShape: await loadLucideIconShape(card.iconName),
		})),
	);
}
