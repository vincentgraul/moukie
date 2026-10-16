import type { Plugin } from "vite";
import { createSitemap } from "./sitemap.ts";

export function sitemapPlugin(urls: readonly string[]): Plugin {
	return {
		name: "moukie:sitemap",
		apply: "build",
		applyToEnvironment: (environment) => environment.name === "client",
		generateBundle() {
			this.emitFile({
				type: "asset",
				fileName: "sitemap.xml",
				source: createSitemap(urls),
			});
		},
	};
}
