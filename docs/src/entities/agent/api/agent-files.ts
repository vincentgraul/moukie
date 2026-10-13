import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { getPluginMetadata, type PluginFile } from "@/shared/api";
import { readPluginFile } from "@/shared/api/index.server";
import { validateAgentMetadata } from "../model/agent-metadata";

const AGENTS_DIRECTORY = "agents";
const AGENT_FILE_EXTENSION = ".md";

export function listAgentFilePaths(pluginRoot: string): string[] {
	return readdirSync(join(pluginRoot, AGENTS_DIRECTORY), {
		withFileTypes: true,
	})
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

export function checkAgentsMetadata(pluginRoot: string): string[] {
	if (!existsSync(join(pluginRoot, AGENTS_DIRECTORY))) {
		return [`${AGENTS_DIRECTORY}/ : dossier absent à la racine du plugin`];
	}
	const paths = listAgentFilePaths(pluginRoot);
	if (paths.length === 0) {
		return [
			`${AGENTS_DIRECTORY}/ : aucun agent trouvé, aucun ${AGENTS_DIRECTORY}/<nom>${AGENT_FILE_EXTENSION}`,
		];
	}
	return paths.flatMap((path) => {
		try {
			const file = readPluginFile(pluginRoot, path);
			return validateAgentMetadata(path, getPluginMetadata(file) ?? {});
		} catch (error) {
			return [`${path} : ${error instanceof Error ? error.message : error}`];
		}
	});
}
