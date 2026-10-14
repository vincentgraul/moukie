import { createServerFn } from "@tanstack/react-start";
import { findPluginRoot } from "@/shared/api/index.server";
import { type PublishedLocale, parsePublishedLocale } from "@/shared/i18n";
import {
	type PluginItemSourceName,
	parsePluginItemSourceName,
} from "../model/plugin-item-source-name";
import { loadPluginItemCardViews } from "./plugin-item-cards";
import { PLUGIN_ITEM_SOURCES } from "./plugin-item-source";

type PluginItemCardsRequest = {
	readonly source: PluginItemSourceName;
	readonly locale: PublishedLocale;
};

export const getPluginItemCards = createServerFn({ method: "GET" })
	.validator(
		(request: PluginItemCardsRequest): PluginItemCardsRequest => ({
			source: parsePluginItemSourceName(request.source),
			locale: parsePublishedLocale(request.locale),
		}),
	)
	.handler(({ data: { source, locale } }) =>
		loadPluginItemCardViews(
			findPluginRoot(),
			PLUGIN_ITEM_SOURCES[source],
			locale,
		),
	);
