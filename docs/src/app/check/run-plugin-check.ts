import { findPluginRoot } from "@/shared/api/index.server";
import { checkPluginMetadata } from "./plugin-metadata";

function runPluginCheck() {
	try {
		return checkPluginMetadata(findPluginRoot());
	} catch (error) {
		return [error instanceof Error ? error.message : String(error)];
	}
}

const errors = runPluginCheck();

if (errors.length > 0) {
	console.error(`Métadonnées du plugin invalides (${errors.length}) :`);
	for (const error of errors) {
		console.error(`  ${error}`);
	}
	process.exit(1);
}

console.log("Métadonnées du plugin valides.");
