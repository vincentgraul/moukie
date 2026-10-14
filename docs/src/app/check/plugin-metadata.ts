import {
	AGENT_SOURCE,
	checkPluginItemsMetadata,
	SKILL_SOURCE,
} from "@/entities/plugin-item/index.server";

export function checkPluginMetadata(pluginRoot: string): string[] {
	return [
		...checkPluginItemsMetadata(pluginRoot, SKILL_SOURCE),
		...checkPluginItemsMetadata(pluginRoot, AGENT_SOURCE),
	];
}
