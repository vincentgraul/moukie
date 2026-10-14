import { existsSync } from "node:fs";
import { join } from "node:path";
import { getPluginMetadata, type PluginFile } from "./plugin-file";
import {
	type PluginBadge,
	type PluginItemKind,
	validatePluginMetadata,
} from "./plugin-metadata";
import { readPluginFile } from "./read-plugin-file";

export type PluginItemSource<Badge extends PluginBadge> =
	PluginItemKind<Badge> & {
		readonly directory: string;
		readonly pathPattern: string;
		readonly listFilePaths: (pluginRoot: string) => string[];
	};

export function readPluginItemFiles<Badge extends PluginBadge>(
	pluginRoot: string,
	source: PluginItemSource<Badge>,
): PluginFile[] {
	return source
		.listFilePaths(pluginRoot)
		.map((path) => readPluginFile(pluginRoot, path));
}

export function checkPluginItemsMetadata<Badge extends PluginBadge>(
	pluginRoot: string,
	source: PluginItemSource<Badge>,
): string[] {
	if (!existsSync(join(pluginRoot, source.directory))) {
		return [`${source.directory}/ : dossier absent à la racine du plugin`];
	}
	const paths = source.listFilePaths(pluginRoot);
	if (paths.length === 0) {
		return [
			`${source.directory}/ : aucun ${source.noun} trouvé, aucun ${source.pathPattern}`,
		];
	}
	return paths.flatMap((path) => {
		try {
			const file = readPluginFile(pluginRoot, path);
			return validatePluginMetadata(
				path,
				getPluginMetadata(file) ?? {},
				source,
			);
		} catch (error) {
			return [`${path} : ${error instanceof Error ? error.message : error}`];
		}
	});
}
