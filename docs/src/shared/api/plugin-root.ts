import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const PLUGIN_MANIFEST = join(".claude-plugin", "plugin.json");

export function findPluginRoot(startDirectory: string = process.cwd()): string {
	let directory = resolve(startDirectory);
	while (!existsSync(join(directory, PLUGIN_MANIFEST))) {
		const parentDirectory = dirname(directory);
		if (parentDirectory === directory) {
			throw new Error(
				`racine du plugin introuvable : aucun dossier parent de ${startDirectory} ne contient .claude-plugin/plugin.json`,
			);
		}
		directory = parentDirectory;
	}
	return directory;
}
