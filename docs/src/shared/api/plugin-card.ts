import type { IconName } from "lucide-react/dynamic";
import { isLucideIconName } from "@/shared/lib";
import { getPluginMetadata, type PluginFile } from "./plugin-file";
import {
	type DisplayedPluginBadge,
	isDisplayedPluginBadge,
	isPluginItemBadge,
	type PluginBadge,
	type PluginItemKind,
	validatePluginMetadata,
} from "./plugin-metadata";

export type PluginCard<Badge extends PluginBadge> = {
	readonly name: string;
	readonly badge: DisplayedPluginBadge<Badge>;
	readonly iconName: IconName;
	readonly rank: number;
	readonly summary: string;
	readonly produces?: string;
};

export function toPluginCard<Badge extends PluginBadge>(
	file: PluginFile,
	kind: PluginItemKind<Badge>,
): PluginCard<Badge> | undefined {
	const metadata = getPluginMetadata(file) ?? {};
	const errors = validatePluginMetadata(file.path, metadata, kind);
	if (errors.length > 0) {
		throw new Error(errors.join("\n"));
	}
	const badge = metadata["moukie-badge"];
	const iconName = metadata["moukie-icon"];
	if (!isPluginItemBadge(kind, badge)) {
		throw new Error(`${file.path} : moukie-badge invalide`);
	}
	if (!isDisplayedPluginBadge(badge)) {
		return undefined;
	}
	if (!isLucideIconName(iconName)) {
		throw new Error(`${file.path} : moukie-icon invalide`);
	}
	const produces = metadata["moukie-produces"];
	return {
		name: readPluginItemName(file),
		badge,
		iconName,
		rank: Number(metadata["moukie-rank"]),
		summary: metadata["moukie-summary"],
		...(produces ? { produces } : {}),
	};
}

function comparePluginCards<Badge extends PluginBadge>(
	first: PluginCard<Badge>,
	second: PluginCard<Badge>,
) {
	return first.rank - second.rank || first.name.localeCompare(second.name);
}

export function selectPluginCards<Badge extends PluginBadge>(
	files: readonly PluginFile[],
	kind: PluginItemKind<Badge>,
): PluginCard<Badge>[] {
	return files
		.map((file) => toPluginCard(file, kind))
		.filter((card) => card !== undefined)
		.sort(comparePluginCards);
}

function readPluginItemName(file: PluginFile) {
	const name = file.frontmatter.name;
	if (typeof name !== "string" || name === "") {
		throw new Error(`${file.path} : name manquant`);
	}
	return name;
}
