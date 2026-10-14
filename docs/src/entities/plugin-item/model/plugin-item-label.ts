export type PluginItemLabel = {
	readonly noun: string;
	readonly indefinite: string;
	readonly definite: string;
	readonly possessive: string;
};

export const SKILL_LABEL: PluginItemLabel = {
	noun: "skill",
	indefinite: "un skill",
	definite: "le skill",
	possessive: "du skill",
};

export const AGENT_LABEL: PluginItemLabel = {
	noun: "agent",
	indefinite: "un agent",
	definite: "l'agent",
	possessive: "de l'agent",
};
