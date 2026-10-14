import {
	loadPluginCardViews,
	type PluginCardView,
	readPluginCards,
} from "@/shared/api/index.server";
import type { PublishedLocale } from "@/shared/i18n";
import type { AgentCard } from "../model/agent-card";
import type { AgentBadge } from "../model/agent-metadata";
import { AGENT_SOURCE } from "./agent-files";

export type AgentCardView = PluginCardView<AgentBadge>;

export function readAgentCards(
	pluginRoot: string,
	locale: PublishedLocale,
): AgentCard[] {
	return readPluginCards(pluginRoot, AGENT_SOURCE, locale);
}

export function loadAgentCardViews(
	pluginRoot: string,
	locale: PublishedLocale,
): Promise<AgentCardView[]> {
	return loadPluginCardViews(pluginRoot, AGENT_SOURCE, locale);
}
