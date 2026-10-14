import {
	type PluginCard,
	type PluginFile,
	selectPluginCards,
	toPluginCard,
} from "@/shared/api";
import { SKILL_KIND, type SkillBadge } from "./skill-metadata";

export type SkillCard = PluginCard<SkillBadge>;

export function toSkillCard(file: PluginFile): SkillCard | undefined {
	return toPluginCard(file, SKILL_KIND);
}

export function selectSkillCards(files: readonly PluginFile[]): SkillCard[] {
	return selectPluginCards(files, SKILL_KIND);
}
