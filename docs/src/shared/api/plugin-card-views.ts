import { renderLucideIconMarkup } from "@/shared/lib/index.server";
import type { PluginCard } from "./plugin-card";
import type { PluginBadge } from "./plugin-metadata";

export type PluginCardView<Badge extends PluginBadge> = PluginCard<Badge> & {
	readonly iconMarkup: string;
};

export function addIconMarkup<Badge extends PluginBadge>(
	cards: readonly PluginCard<Badge>[],
): Promise<PluginCardView<Badge>[]> {
	return Promise.all(
		cards.map(async (card) => ({
			...card,
			iconMarkup: await renderLucideIconMarkup(card.iconName),
		})),
	);
}
