import { addIconMarkup, type PluginCardView } from "@/shared/api/index.server";
import { type AgentCard, selectAgentCards } from "../model/agent-card";
import type { AgentBadge } from "../model/agent-metadata";
import { readAgentFiles } from "./agent-files";

export type AgentCardView = PluginCardView<AgentBadge>;

export function readAgentCards(pluginRoot: string): AgentCard[] {
	return selectAgentCards(readAgentFiles(pluginRoot));
}

export function loadAgentCardViews(
	pluginRoot: string,
): Promise<AgentCardView[]> {
	return addIconMarkup(readAgentCards(pluginRoot));
}
