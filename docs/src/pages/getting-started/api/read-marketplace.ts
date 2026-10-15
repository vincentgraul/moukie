import { readFileSync } from "node:fs";
import { join } from "node:path";

export type Marketplace = {
	readonly marketplaceName: string;
	readonly pluginName: string;
};

const MARKETPLACE_FILE = join(".claude-plugin", "marketplace.json");
const ROOT_PLUGIN_SOURCE = "./";

function readName(value: unknown, description: string): string {
	if (typeof value !== "string" || value === "") {
		throw new Error(`${MARKETPLACE_FILE} : ${description} manquant`);
	}
	return value;
}

export function readMarketplace(pluginRoot: string): Marketplace {
	const marketplace: unknown = JSON.parse(
		readFileSync(join(pluginRoot, MARKETPLACE_FILE), "utf8"),
	);
	const { name, plugins } = (marketplace ?? {}) as {
		name?: unknown;
		plugins?: unknown;
	};
	const rootPlugin = (Array.isArray(plugins) ? plugins : []).find(
		(plugin) => plugin?.source === ROOT_PLUGIN_SOURCE,
	);
	return {
		marketplaceName: readName(name, "nom de la marketplace"),
		pluginName: readName(
			rootPlugin?.name,
			`nom du plugin publié depuis ${ROOT_PLUGIN_SOURCE}`,
		),
	};
}
