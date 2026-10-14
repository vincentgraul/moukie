import {
	type PluginCard,
	type PluginFile,
	selectPluginCards,
	toPluginCard,
} from "@/shared/api";
import { AGENT_KIND, type AgentBadge } from "./agent-metadata";

export type AgentCard = PluginCard<AgentBadge>;

export function toAgentCard(file: PluginFile): AgentCard | undefined {
	return toPluginCard(file, AGENT_KIND);
}

export function selectAgentCards(files: readonly PluginFile[]): AgentCard[] {
	return selectPluginCards(files, AGENT_KIND);
}
