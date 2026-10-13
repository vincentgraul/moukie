import { fileURLToPath } from "node:url";

export const PLUGIN_ROOT = fileURLToPath(
	new URL("../../../../", import.meta.url),
);
