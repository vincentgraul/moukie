import { findPluginRoot } from "@/shared/api/index.server";
import { checkContentTranslations } from "./content-translations";
import { checkPluginMetadata } from "./plugin-metadata";

function runCheck(check: (pluginRoot: string) => string[]) {
	try {
		return check(findPluginRoot());
	} catch (error) {
		return [error instanceof Error ? error.message : String(error)];
	}
}

const CHECKS = [
	{
		check: checkPluginMetadata,
		failure: "Métadonnées du plugin invalides",
		success: "Métadonnées du plugin valides.",
	},
	{
		check: checkContentTranslations,
		failure: "Traductions du contenu du plugin à mettre à jour",
		success: "Traductions du contenu du plugin à jour.",
	},
];

let hasFailed = false;

for (const { check, failure, success } of CHECKS) {
	const errors = runCheck(check);
	if (errors.length === 0) {
		console.log(success);
		continue;
	}
	hasFailed = true;
	console.error(`${failure} (${errors.length}) :`);
	for (const error of errors) {
		console.error(`  ${error}`);
	}
}

if (hasFailed) {
	process.exit(1);
}
