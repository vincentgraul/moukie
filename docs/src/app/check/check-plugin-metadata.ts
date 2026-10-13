import { PLUGIN_ROOT } from "@/shared/config";
import { checkPluginMetadata } from "./plugin-metadata";

const errors = checkPluginMetadata(PLUGIN_ROOT);

if (errors.length > 0) {
	console.error(`Métadonnées du plugin invalides (${errors.length}) :`);
	for (const error of errors) {
		console.error(`  ${error}`);
	}
	process.exit(1);
}

console.log("Métadonnées du plugin valides.");
