import type { IconName } from "lucide-react/dynamic";
import { getPluginMetadata, type PluginFile } from "@/shared/api";
import { isLucideIconName } from "@/shared/lib";
import type { PluginItemLabel } from "./plugin-item-label";
import {
	type DisplayedPluginItemBadge,
	isDisplayedPluginItemBadge,
	isPluginItemBadge,
	validatePluginItemMetadata,
} from "./plugin-item-metadata";

export type PluginItemCard = {
	readonly name: string;
	readonly badge: DisplayedPluginItemBadge;
	readonly iconName: IconName;
	readonly rank: number;
	readonly summary: string;
	readonly produces?: string;
};

export function toPluginItemCard(
	file: PluginFile,
	label: PluginItemLabel,
): PluginItemCard | undefined {
	const metadata = getPluginMetadata(file) ?? {};
	const errors = validatePluginItemMetadata(file.path, metadata, label);
	if (errors.length > 0) {
		throw new Error(errors.join("\n"));
	}
	const badge = metadata["moukie-badge"];
	const iconName = metadata["moukie-icon"];
	if (!isPluginItemBadge(badge)) {
		throw new Error(`${file.path} : moukie-badge invalide`);
	}
	if (!isDisplayedPluginItemBadge(badge)) {
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

function comparePluginItemCards(first: PluginItemCard, second: PluginItemCard) {
	return first.rank - second.rank || first.name.localeCompare(second.name);
}

export function selectPluginItemCards(
	files: readonly PluginFile[],
	label: PluginItemLabel,
): PluginItemCard[] {
	return files
		.map((file) => toPluginItemCard(file, label))
		.filter((card) => card !== undefined)
		.sort(comparePluginItemCards);
}

function readPluginItemName(file: PluginFile) {
	const name = file.frontmatter.name;
	if (typeof name !== "string" || name === "") {
		throw new Error(`${file.path} : name manquant`);
	}
	return name;
}
