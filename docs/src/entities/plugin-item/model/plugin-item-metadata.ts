import type { PluginMetadata } from "@/shared/api";
import { isLucideIconName } from "@/shared/lib";
import type { PluginItemLabel } from "./plugin-item-label";

export const PLUGIN_ITEM_BADGES = [
	"project",
	"feature",
	"story",
	"lane",
	"review",
	"knowledge",
] as const;

export type PluginItemBadge = (typeof PLUGIN_ITEM_BADGES)[number];

const HIDDEN_BADGE = "knowledge";

export type DisplayedPluginItemBadge = Exclude<
	PluginItemBadge,
	typeof HIDDEN_BADGE
>;

const DISPLAYED_ITEM_REQUIRED_KEYS = [
	"moukie-summary",
	"moukie-icon",
	"moukie-rank",
] as const;

const RANK_PATTERN = /^\d+$/;

export function isPluginItemBadge(value: string): value is PluginItemBadge {
	return (PLUGIN_ITEM_BADGES as readonly string[]).includes(value);
}

export function isDisplayedPluginItemBadge(
	badge: PluginItemBadge,
): badge is DisplayedPluginItemBadge {
	return badge !== HIDDEN_BADGE;
}

export function validatePluginItemMetadata(
	path: string,
	metadata: PluginMetadata,
	label: PluginItemLabel,
): string[] {
	const errors: string[] = [];
	const badge = metadata["moukie-badge"];
	const icon = metadata["moukie-icon"];
	const rank = metadata["moukie-rank"];

	if (!badge) {
		errors.push(`${path} : moukie-badge manquant`);
	} else if (!isPluginItemBadge(badge)) {
		errors.push(
			`${path} : moukie-badge « ${badge} » inconnu, attendu l'un de ${PLUGIN_ITEM_BADGES.join(", ")}`,
		);
	} else if (isDisplayedPluginItemBadge(badge)) {
		for (const key of DISPLAYED_ITEM_REQUIRED_KEYS) {
			if (!metadata[key]) {
				errors.push(
					`${path} : ${key} manquant pour ${label.indefinite} « ${badge} »`,
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
