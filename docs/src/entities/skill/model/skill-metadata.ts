import type { PluginMetadata } from "@/shared/api";
import { isLucideIconName } from "@/shared/lib";

export const SKILL_BADGES = [
	"project",
	"feature",
	"story",
	"lane",
	"review",
	"knowledge",
] as const;

export type SkillBadge = (typeof SKILL_BADGES)[number];

const DISPLAYED_SKILL_REQUIRED_KEYS = [
	"moukie-summary",
	"moukie-icon",
	"moukie-rank",
] as const;

const RANK_PATTERN = /^\d+$/;

export function isSkillBadge(value: string): value is SkillBadge {
	return (SKILL_BADGES as readonly string[]).includes(value);
}

export function validateSkillMetadata(
	path: string,
	metadata: PluginMetadata,
): string[] {
	const errors: string[] = [];
	const badge = metadata["moukie-badge"];
	const icon = metadata["moukie-icon"];
	const rank = metadata["moukie-rank"];

	if (!badge) {
		errors.push(`${path} : moukie-badge manquant`);
	} else if (!isSkillBadge(badge)) {
		errors.push(
			`${path} : moukie-badge « ${badge} » inconnu, attendu l'un de ${SKILL_BADGES.join(", ")}`,
		);
	} else if (badge !== "knowledge") {
		for (const key of DISPLAYED_SKILL_REQUIRED_KEYS) {
			if (!metadata[key]) {
				errors.push(`${path} : ${key} manquant pour un skill « ${badge} »`);
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
