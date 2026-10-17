import type { Plugin } from "vite";
import { createRobots } from "./robots.ts";

export function robotsPlugin(sitemapUrl: string): Plugin {
	return {
		name: "moukie:robots",
		apply: "build",
		applyToEnvironment: (environment) => environment.name === "client",
		generateBundle() {
			this.emitFile({
				type: "asset",
				fileName: "robots.txt",
				source: createRobots(sitemapUrl),
			});
		},
	};
}
