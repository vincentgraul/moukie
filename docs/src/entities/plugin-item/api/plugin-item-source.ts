import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
	AGENT_LABEL,
	type PluginItemLabel,
	SKILL_LABEL,
} from "../model/plugin-item-label";
import type { PluginItemSourceName } from "../model/plugin-item-source-name";

export type PluginItemSource = {
	readonly directory: string;
	readonly pathPattern: string;
	readonly label: PluginItemLabel;
	readonly listFilePaths: (pluginRoot: string) => string[];
};

const SKILL_FILE_NAME = "SKILL.md";
const AGENT_FILE_EXTENSION = ".md";

export const SKILL_SOURCE: PluginItemSource = {
	directory: "skills",
	pathPattern: `skills/<nom>/${SKILL_FILE_NAME}`,
	label: SKILL_LABEL,
	listFilePaths: (pluginRoot) =>
		readdirSync(join(pluginRoot, "skills"), { withFileTypes: true })
			.filter((entry) => entry.isDirectory())
			.map((entry) => `skills/${entry.name}/${SKILL_FILE_NAME}`)
			.filter((path) => existsSync(join(pluginRoot, path)))
			.sort(),
};

export const AGENT_SOURCE: PluginItemSource = {
	directory: "agents",
	pathPattern: `agents/<nom>${AGENT_FILE_EXTENSION}`,
	label: AGENT_LABEL,
	listFilePaths: (pluginRoot) =>
		readdirSync(join(pluginRoot, "agents"), { withFileTypes: true })
			.filter(
				(entry) => entry.isFile() && entry.name.endsWith(AGENT_FILE_EXTENSION),
			)
			.map((entry) => `agents/${entry.name}`)
			.sort(),
};

export const PLUGIN_ITEM_SOURCES: Readonly<
	Record<PluginItemSourceName, PluginItemSource>
> = {
	skills: SKILL_SOURCE,
	agents: AGENT_SOURCE,
};
