import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { type PluginFile, readPluginFile } from "@/shared/api";

const AGENTS_DIRECTORY = "agents";
const AGENT_FILE_EXTENSION = ".md";

export function listAgentFilePaths(pluginRoot: string): string[] {
	const agentsDirectory = join(pluginRoot, AGENTS_DIRECTORY);
	if (!existsSync(agentsDirectory)) {
		return [];
	}
	return readdirSync(agentsDirectory, { withFileTypes: true })
		.filter(
			(entry) => entry.isFile() && entry.name.endsWith(AGENT_FILE_EXTENSION),
		)
		.map((entry) => `${AGENTS_DIRECTORY}/${entry.name}`)
		.sort();
}

export function readAgentFiles(pluginRoot: string): PluginFile[] {
	return listAgentFilePaths(pluginRoot).map((path) =>
		readPluginFile(pluginRoot, path),
	);
}
