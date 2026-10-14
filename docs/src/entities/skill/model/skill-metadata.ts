import {
	PLUGIN_BADGES,
	type PluginBadge,
	type PluginItemKind,
} from "@/shared/api";

export type SkillBadge = PluginBadge;

export const SKILL_KIND: PluginItemKind<SkillBadge> = {
	noun: "skill",
	badges: PLUGIN_BADGES,
};
