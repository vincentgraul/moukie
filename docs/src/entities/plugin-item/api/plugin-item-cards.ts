import { renderLucideIconMarkup } from "@/shared/lib/index.server";
import {
	type PluginItemCard,
	selectPluginItemCards,
} from "../model/plugin-item-card";
import { readPluginItemFiles } from "./plugin-item-files";
import type { PluginItemSource } from "./plugin-item-source";
import { localizePluginItemCards } from "./plugin-item-translation-files";

export type PluginItemCardView = PluginItemCard & {
	readonly iconMarkup: string;
};

export function readPluginItemCards(
	pluginRoot: string,
	source: PluginItemSource,
	locale: string,
): PluginItemCard[] {
	const cards = selectPluginItemCards(
		readPluginItemFiles(pluginRoot, source),
		source.label,
	);
	return localizePluginItemCards(pluginRoot, cards, locale, source);
}

export function loadPluginItemCardViews(
	pluginRoot: string,
	source: PluginItemSource,
	locale: string,
): Promise<PluginItemCardView[]> {
	return Promise.all(
		readPluginItemCards(pluginRoot, source, locale).map(async (card) => ({
			...card,
			iconMarkup: await renderLucideIconMarkup(card.iconName),
		})),
	);
}
