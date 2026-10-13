import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { getPluginMetadata, type PluginFile } from "@/shared/api";
import { readPluginFile } from "@/shared/api/index.server";
import { validateSkillMetadata } from "../model/skill-metadata";

const SKILLS_DIRECTORY = "skills";
const SKILL_FILE_NAME = "SKILL.md";

export function listSkillFilePaths(pluginRoot: string): string[] {
	return readdirSync(join(pluginRoot, SKILLS_DIRECTORY), {
		withFileTypes: true,
	})
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

export function checkSkillsMetadata(pluginRoot: string): string[] {
	if (!existsSync(join(pluginRoot, SKILLS_DIRECTORY))) {
		return [`${SKILLS_DIRECTORY}/ : dossier absent à la racine du plugin`];
	}
	const paths = listSkillFilePaths(pluginRoot);
	if (paths.length === 0) {
		return [
			`${SKILLS_DIRECTORY}/ : aucun skill trouvé, aucun ${SKILLS_DIRECTORY}/<nom>/${SKILL_FILE_NAME}`,
		];
	}
	return paths.flatMap((path) => {
		try {
			const file = readPluginFile(pluginRoot, path);
			return validateSkillMetadata(path, getPluginMetadata(file) ?? {});
		} catch (error) {
			return [`${path} : ${error instanceof Error ? error.message : error}`];
		}
	});
}
