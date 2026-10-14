import type { IconName } from "lucide-react/dynamic";
import { getPluginMetadata, type PluginFile } from "@/shared/api";
import { isLucideIconName } from "@/shared/lib";
import {
	type AgentBadge,
	isAgentBadge,
	validateAgentMetadata,
} from "./agent-metadata";

type DisplayedAgentBadge = Exclude<AgentBadge, "knowledge">;

export type AgentCard = {
	readonly name: string;
	readonly badge: DisplayedAgentBadge;
	readonly iconName: IconName;
	readonly rank: number;
	readonly summary: string;
	readonly produces?: string;
};

export function toAgentCard(file: PluginFile): AgentCard | undefined {
	const metadata = getPluginMetadata(file) ?? {};
	const errors = validateAgentMetadata(file.path, metadata);
	if (errors.length > 0) {
		throw new Error(errors.join("\n"));
	}
	const badge = metadata["moukie-badge"];
	const iconName = metadata["moukie-icon"];
	if (!isAgentBadge(badge)) {
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
		name: readAgentName(file),
		badge,
		iconName,
		rank: Number(metadata["moukie-rank"]),
		summary: metadata["moukie-summary"],
		...(produces ? { produces } : {}),
	};
}

function compareAgentCards(first: AgentCard, second: AgentCard) {
	return first.rank - second.rank || first.name.localeCompare(second.name);
}

export function selectAgentCards(files: readonly PluginFile[]): AgentCard[] {
	return files
		.map(toAgentCard)
		.filter((card) => card !== undefined)
		.sort(compareAgentCards);
}

function readAgentName(file: PluginFile) {
	const name = file.frontmatter.name;
	if (typeof name !== "string" || name === "") {
		throw new Error(`${file.path} : name manquant`);
	}
	return name;
}
