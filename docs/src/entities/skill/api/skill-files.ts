import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { PluginFile } from "@/shared/api";
import {
	checkPluginItemsMetadata,
	type PluginItemSource,
	readPluginItemFiles,
} from "@/shared/api/index.server";
import { SKILL_KIND, type SkillBadge } from "../model/skill-metadata";

const SKILLS_DIRECTORY = "skills";
const SKILL_FILE_NAME = "SKILL.md";

function listSkillFilePaths(pluginRoot: string): string[] {
	return readdirSync(join(pluginRoot, SKILLS_DIRECTORY), {
		withFileTypes: true,
	})
		.filter((entry) => entry.isDirectory())
		.map((entry) => `${SKILLS_DIRECTORY}/${entry.name}/${SKILL_FILE_NAME}`)
		.filter((path) => existsSync(join(pluginRoot, path)))
		.sort();
}

const SKILL_SOURCE: PluginItemSource<SkillBadge> = {
	...SKILL_KIND,
	directory: SKILLS_DIRECTORY,
	pathPattern: `${SKILLS_DIRECTORY}/<nom>/${SKILL_FILE_NAME}`,
	listFilePaths: listSkillFilePaths,
};

export function readSkillFiles(pluginRoot: string): PluginFile[] {
	return readPluginItemFiles(pluginRoot, SKILL_SOURCE);
}

export function checkSkillsMetadata(pluginRoot: string): string[] {
	return checkPluginItemsMetadata(pluginRoot, SKILL_SOURCE);
}
