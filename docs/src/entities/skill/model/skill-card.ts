import type { IconName } from "lucide-react/dynamic";
import { getPluginMetadata, type PluginFile } from "@/shared/api";
import { isLucideIconName } from "@/shared/lib";
import {
	isSkillBadge,
	type SkillBadge,
	validateSkillMetadata,
} from "./skill-metadata";

export type DisplayedSkillBadge = Exclude<SkillBadge, "knowledge">;

export type SkillCard = {
	readonly name: string;
	readonly badge: DisplayedSkillBadge;
	readonly iconName: IconName;
	readonly rank: number;
	readonly summary: string;
	readonly produces?: string;
};

export function toSkillCard(file: PluginFile): SkillCard | undefined {
	const metadata = getPluginMetadata(file) ?? {};
	const errors = validateSkillMetadata(file.path, metadata);
	if (errors.length > 0) {
		throw new Error(errors.join("\n"));
	}
	const badge = metadata["moukie-badge"];
	const iconName = metadata["moukie-icon"];
	if (!isSkillBadge(badge)) {
		throw new Error(`${file.path} : moukie-badge invalide`);
	}
	if (badge === "knowledge") {
		return undefined;
	}
	if (!isLucideIconName(iconName)) {
		throw new Error(`${file.path} : moukie-icon invalide`);
	}
	const produces = metadata["moukie-produces"];
	return {
		name: readSkillName(file),
		badge,
		iconName,
		rank: Number(metadata["moukie-rank"]),
		summary: metadata["moukie-summary"],
		...(produces ? { produces } : {}),
	};
}

export function compareSkillCards(first: SkillCard, second: SkillCard) {
	return first.rank - second.rank || first.name.localeCompare(second.name);
}

export function selectSkillCards(files: readonly PluginFile[]): SkillCard[] {
	return files
		.map(toSkillCard)
		.filter((card) => card !== undefined)
		.sort(compareSkillCards);
}

function readSkillName(file: PluginFile) {
	const name = file.frontmatter.name;
	if (typeof name !== "string" || name === "") {
		throw new Error(`${file.path} : name manquant`);
	}
	return name;
}
