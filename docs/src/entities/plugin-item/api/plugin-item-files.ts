import { existsSync } from "node:fs";
import { join } from "node:path";
import { getPluginMetadata, type PluginFile } from "@/shared/api";
import { readPluginFile } from "@/shared/api/index.server";
import { validatePluginItemMetadata } from "../model/plugin-item-metadata";
import type { PluginItemSource } from "./plugin-item-source";

export function readPluginItemFiles(
	pluginRoot: string,
	source: PluginItemSource,
): PluginFile[] {
	return source
		.listFilePaths(pluginRoot)
		.map((path) => readPluginFile(pluginRoot, path));
}

export function checkPluginItemsMetadata(
	pluginRoot: string,
	source: PluginItemSource,
): string[] {
	if (!existsSync(join(pluginRoot, source.directory))) {
		return [`${source.directory}/ : dossier absent à la racine du plugin`];
	}
	const paths = source.listFilePaths(pluginRoot);
	if (paths.length === 0) {
		return [
			`${source.directory}/ : aucun ${source.label.noun} trouvé, aucun ${source.pathPattern}`,
		];
	}
	return paths.flatMap((path) => {
		try {
			const file = readPluginFile(pluginRoot, path);
			return validatePluginItemMetadata(
				path,
				getPluginMetadata(file) ?? {},
				source.label,
			);
		} catch (error) {
			return [`${path} : ${error instanceof Error ? error.message : error}`];
		}
	});
}
