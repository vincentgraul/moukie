import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { type PluginFile, readPluginFile } from "@/shared/api";

const SKILLS_DIRECTORY = "skills";
const SKILL_FILE_NAME = "SKILL.md";

export function listSkillFilePaths(pluginRoot: string): string[] {
	const skillsDirectory = join(pluginRoot, SKILLS_DIRECTORY);
	if (!existsSync(skillsDirectory)) {
		return [];
	}
	return readdirSync(skillsDirectory, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => `${SKILLS_DIRECTORY}/${entry.name}/${SKILL_FILE_NAME}`)
		.filter((path) => existsSync(join(pluginRoot, path)))
		.sort();
}

export function readSkillFiles(pluginRoot: string): PluginFile[] {
	return listSkillFilePaths(pluginRoot).map((path) =>
		readPluginFile(pluginRoot, path),
	);
}
