export const PLUGIN_ITEM_SOURCE_NAMES = ["skills", "agents"] as const;

export type PluginItemSourceName = (typeof PLUGIN_ITEM_SOURCE_NAMES)[number];

function isPluginItemSourceName(value: unknown): value is PluginItemSourceName {
	return (PLUGIN_ITEM_SOURCE_NAMES as readonly unknown[]).includes(value);
}

export function parsePluginItemSourceName(
	value: unknown,
): PluginItemSourceName {
	if (!isPluginItemSourceName(value)) {
		throw new Error(
			`source « ${String(value)} » inconnue, attendu l'une de ${PLUGIN_ITEM_SOURCE_NAMES.join(", ")}`,
		);
	}
	return value;
}
