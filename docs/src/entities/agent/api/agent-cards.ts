import { renderLucideIconMarkup } from "@/shared/lib/index.server";
import { type AgentCard, selectAgentCards } from "../model/agent-card";
import { readAgentFiles } from "./agent-files";

export type AgentCardView = AgentCard & { readonly iconMarkup: string };

export function readAgentCards(pluginRoot: string): AgentCard[] {
	return selectAgentCards(readAgentFiles(pluginRoot));
}

export function loadAgentCardViews(
	pluginRoot: string,
): Promise<AgentCardView[]> {
	return Promise.all(
		readAgentCards(pluginRoot).map(async (card) => ({
			...card,
			iconMarkup: await renderLucideIconMarkup(card.iconName),
		})),
	);
}
