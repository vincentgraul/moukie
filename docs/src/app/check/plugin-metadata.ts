import { checkAgentsMetadata } from "@/entities/agent";
import { checkSkillsMetadata } from "@/entities/skill";

export function checkPluginMetadata(pluginRoot: string): string[] {
	return [
		...checkSkillsMetadata(pluginRoot),
		...checkAgentsMetadata(pluginRoot),
	];
}
