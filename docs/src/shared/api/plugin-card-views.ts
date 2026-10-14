import { renderLucideIconMarkup } from "@/shared/lib/index.server";
import { type PluginCard, selectPluginCards } from "./plugin-card";
import { type PluginItemSource, readPluginItemFiles } from "./plugin-items";
import type { PluginBadge } from "./plugin-metadata";
import { localizePluginCards } from "./plugin-translation-files";

export type PluginCardView<Badge extends PluginBadge> = PluginCard<Badge> & {
	readonly iconMarkup: string;
};

export function readPluginCards<Badge extends PluginBadge>(
	pluginRoot: string,
	source: PluginItemSource<Badge>,
	locale: string,
): PluginCard<Badge>[] {
	const cards = selectPluginCards(
		readPluginItemFiles(pluginRoot, source),
		source,
	);
	return localizePluginCards(pluginRoot, cards, locale, source);
}

export function loadPluginCardViews<Badge extends PluginBadge>(
	pluginRoot: string,
	source: PluginItemSource<Badge>,
	locale: string,
): Promise<PluginCardView<Badge>[]> {
	return Promise.all(
		readPluginCards(pluginRoot, source, locale).map(async (card) => ({
			...card,
			iconMarkup: await renderLucideIconMarkup(card.iconName),
		})),
	);
}
