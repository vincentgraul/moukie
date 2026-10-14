import {
	PLUGIN_BADGES,
	type PluginBadge,
	type PluginItemKind,
} from "@/shared/api";

export type AgentBadge = PluginBadge;

export const AGENT_KIND: PluginItemKind<AgentBadge> = {
	noun: "agent",
	badges: PLUGIN_BADGES,
};
