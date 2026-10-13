import { checkPluginFile } from "@/shared/api";
import { listSkillFilePaths } from "../api/skill-files";

export function checkSkillsMetadata(pluginRoot: string): string[] {
	return listSkillFilePaths(pluginRoot).flatMap((path) =>
		checkPluginFile(pluginRoot, path),
	);
}
