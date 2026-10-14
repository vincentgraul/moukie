import { isLucideIconName } from "@/shared/lib";
import type { PluginMetadata } from "./plugin-file";

export const PLUGIN_BADGES = [
	"project",
	"feature",
	"story",
	"lane",
	"review",
	"knowledge",
] as const;

export type PluginBadge = (typeof PLUGIN_BADGES)[number];

export type HiddenPluginBadge = "knowledge";

export type DisplayedPluginBadge<Badge extends PluginBadge> = Exclude<
	Badge,
	HiddenPluginBadge
>;

export type PluginItemKind<Badge extends PluginBadge> = {
	readonly noun: string;
	readonly badges: readonly Badge[];
};

const HIDDEN_BADGE: HiddenPluginBadge = "knowledge";

const DISPLAYED_ITEM_REQUIRED_KEYS = [
	"moukie-summary",
	"moukie-icon",
	"moukie-rank",
] as const;

const RANK_PATTERN = /^\d+$/;

export function isPluginItemBadge<Badge extends PluginBadge>(
	kind: PluginItemKind<Badge>,
	value: string,
): value is Badge {
	return (kind.badges as readonly string[]).includes(value);
}

export function isDisplayedPluginBadge<Badge extends PluginBadge>(
	badge: Badge,
): badge is DisplayedPluginBadge<Badge> {
	return badge !== HIDDEN_BADGE;
}

export function validatePluginMetadata<Badge extends PluginBadge>(
	path: string,
	metadata: PluginMetadata,
	kind: PluginItemKind<Badge>,
): string[] {
	const errors: string[] = [];
	const badge = metadata["moukie-badge"];
	const icon = metadata["moukie-icon"];
	const rank = metadata["moukie-rank"];

	if (!badge) {
		errors.push(`${path} : moukie-badge manquant`);
	} else if (!isPluginItemBadge(kind, badge)) {
		errors.push(
			`${path} : moukie-badge « ${badge} » inconnu, attendu l'un de ${kind.badges.join(", ")}`,
		);
	} else if (isDisplayedPluginBadge(badge)) {
		for (const key of DISPLAYED_ITEM_REQUIRED_KEYS) {
			if (!metadata[key]) {
				errors.push(
					`${path} : ${key} manquant pour un ${kind.noun} « ${badge} »`,
				);
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
