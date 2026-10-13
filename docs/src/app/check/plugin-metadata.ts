import { checkAgentsMetadata } from "@/entities/agent/index.server";
import { checkSkillsMetadata } from "@/entities/skill/index.server";

export function checkPluginMetadata(pluginRoot: string): string[] {
	return [
		...checkSkillsMetadata(pluginRoot),
		...checkAgentsMetadata(pluginRoot),
	];
}
