import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
	type Frontmatter,
	isLucideIconName,
	parseFrontmatter,
} from "@/shared/lib";

export const PLUGIN_BADGES = [
	"project",
	"feature",
	"story",
	"lane",
	"review",
	"knowledge",
] as const;

export type PluginBadge = (typeof PLUGIN_BADGES)[number];

export type PluginMetadata = Readonly<Record<string, string>>;

export type PluginFile = {
	readonly path: string;
	readonly frontmatter: Frontmatter;
};

const DISPLAYED_ITEM_REQUIRED_KEYS = [
	"moukie-summary",
	"moukie-icon",
	"moukie-rank",
] as const;
const RANK_PATTERN = /^\d+$/;

export function readPluginFile(pluginRoot: string, path: string): PluginFile {
	const source = readFileSync(join(pluginRoot, path), "utf8");
	return { path, frontmatter: parseFrontmatter(source) };
}

export function getPluginMetadata(
	file: PluginFile,
): PluginMetadata | undefined {
	const metadata = file.frontmatter.metadata;
	if (
		metadata === undefined ||
		typeof metadata === "string" ||
		Array.isArray(metadata)
	) {
		return undefined;
	}
	return metadata as PluginMetadata;
}

export function isPluginBadge(value: string): value is PluginBadge {
	return (PLUGIN_BADGES as readonly string[]).includes(value);
}

export function checkPluginFile(pluginRoot: string, path: string): string[] {
	let file: PluginFile;
	try {
		file = readPluginFile(pluginRoot, path);
	} catch (error) {
		return [
			`${path} : ${error instanceof Error ? error.message : String(error)}`,
		];
	}
	return validatePluginMetadata(path, getPluginMetadata(file) ?? {});
}

function validatePluginMetadata(
	path: string,
	metadata: PluginMetadata,
): string[] {
	const errors: string[] = [];
	const badge = metadata["moukie-badge"];
	const icon = metadata["moukie-icon"];
	const rank = metadata["moukie-rank"];

	if (!badge) {
		errors.push(`${path} : moukie-badge manquant`);
	} else if (!isPluginBadge(badge)) {
		errors.push(
			`${path} : moukie-badge « ${badge} » inconnu, attendu l'un de ${PLUGIN_BADGES.join(", ")}`,
		);
	} else if (badge !== "knowledge") {
		for (const key of DISPLAYED_ITEM_REQUIRED_KEYS) {
			if (!metadata[key]) {
				errors.push(`${path} : ${key} manquant pour un élément « ${badge} »`);
			}
		}
	}

	if (icon && !isLucideIconName(icon)) {
		errors.push(`${path} : moukie-icon « ${icon} » n'est pas une icône Lucide`);
	}
	if (rank && !RANK_PATTERN.test(rank)) {
		errors.push(`${path} : moukie-rank « ${rank} » n'est pas un entier`);
	}

	return errors;
}
