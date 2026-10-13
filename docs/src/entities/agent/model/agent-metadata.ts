import type { PluginMetadata } from "@/shared/api";
import { isLucideIconName } from "@/shared/lib";

export const AGENT_BADGES = [
	"project",
	"feature",
	"story",
	"lane",
	"review",
	"knowledge",
] as const;

export type AgentBadge = (typeof AGENT_BADGES)[number];

const DISPLAYED_AGENT_REQUIRED_KEYS = [
	"moukie-summary",
	"moukie-icon",
	"moukie-rank",
] as const;

const RANK_PATTERN = /^\d+$/;

export function isAgentBadge(value: string): value is AgentBadge {
	return (AGENT_BADGES as readonly string[]).includes(value);
}

export function validateAgentMetadata(
	path: string,
	metadata: PluginMetadata,
): string[] {
	const errors: string[] = [];
	const badge = metadata["moukie-badge"];
	const icon = metadata["moukie-icon"];
	const rank = metadata["moukie-rank"];

	if (!badge) {
		errors.push(`${path} : moukie-badge manquant`);
	} else if (!isAgentBadge(badge)) {
		errors.push(
			`${path} : moukie-badge « ${badge} » inconnu, attendu l'un de ${AGENT_BADGES.join(", ")}`,
		);
	} else if (badge !== "knowledge") {
		for (const key of DISPLAYED_AGENT_REQUIRED_KEYS) {
			if (!metadata[key]) {
				errors.push(`${path} : ${key} manquant pour un agent « ${badge} »`);
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
