import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { sitemapPlugin } from "./src/app/seo/sitemap-plugin.ts";
import {
	listPagePaths,
	PUBLISHED_LOCALE_CODES,
	SITE_PAGES,
	toPagePath,
} from "./src/shared/config/site-map.ts";
import { toAbsoluteUrl } from "./src/shared/config/site-url.ts";

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
				{ path: "/404", prerender: { outputPath: "/404.html" } },
				{ path: `${toPagePath("en")}404/` },
				...PUBLISHED_LOCALE_CODES.flatMap((locale) => [
					{ path: toPagePath(locale) },
					...SITE_PAGES.map((page) => ({ path: toPagePath(locale, page) })),
				]),
			],
			prerender: {
				enabled: true,
				crawlLinks: true,
				failOnError: true,
			},
		}),
		viteReact(),
		sitemapPlugin(listPagePaths().map(toAbsoluteUrl)),
	],
});
