import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import {
	PUBLISHED_LOCALE_CODES,
	SITE_PAGES,
	toPagePath,
} from "./src/shared/config/site-map.ts";

export default defineConfig({
	base: "/moukie/",
	resolve: { tsconfigPaths: true },
	preview: { host: "127.0.0.1" },
	plugins: [
		paraglideVitePlugin({
			project: "./project.inlang",
			outdir: "./src/shared/i18n/paraglide",
		}),
		tanstackStart({
			router: {
				entry: "app/router.tsx",
				routesDirectory: "app/routes",
				generatedRouteTree: "app/routeTree.gen.ts",
			},
			pages: [
				{ path: "/" },
				...PUBLISHED_LOCALE_CODES.flatMap((locale) => [
					{ path: toPagePath(locale) },
					...SITE_PAGES.map((page) => ({ path: toPagePath(locale, page) })),
				]),
			],
			prerender: {
				enabled: true,
				crawlLinks: true,
				failOnError: true,
				retryCount: 2,
				retryDelay: 500,
			},
		}),
		viteReact(),
	],
});
