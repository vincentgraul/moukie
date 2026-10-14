import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { PluginFile } from "@/shared/api";
import {
	checkPluginItemsMetadata,
	checkPluginTranslations,
	type PluginItemSource,
	readPluginItemFiles,
} from "@/shared/api/index.server";
import { AGENT_KIND, type AgentBadge } from "../model/agent-metadata";

const AGENTS_DIRECTORY = "agents";
const AGENT_FILE_EXTENSION = ".md";

function listAgentFilePaths(pluginRoot: string): string[] {
	return readdirSync(join(pluginRoot, AGENTS_DIRECTORY), {
		withFileTypes: true,
	})
		.filter(
			(entry) => entry.isFile() && entry.name.endsWith(AGENT_FILE_EXTENSION),
		)
		.map((entry) => `${AGENTS_DIRECTORY}/${entry.name}`)
		.sort();
}

export const AGENT_SOURCE: PluginItemSource<AgentBadge> = {
	...AGENT_KIND,
	directory: AGENTS_DIRECTORY,
	pathPattern: `${AGENTS_DIRECTORY}/<nom>${AGENT_FILE_EXTENSION}`,
	listFilePaths: listAgentFilePaths,
};

export function readAgentFiles(pluginRoot: string): PluginFile[] {
	return readPluginItemFiles(pluginRoot, AGENT_SOURCE);
}

export function checkAgentsMetadata(pluginRoot: string): string[] {
	return checkPluginItemsMetadata(pluginRoot, AGENT_SOURCE);
}

export function checkAgentTranslations(
	pluginRoot: string,
	locale: string,
): string[] {
	return checkPluginTranslations(pluginRoot, AGENT_SOURCE, locale);
}
