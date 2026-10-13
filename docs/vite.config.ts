import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	base: "/moukie/",
	resolve: { tsconfigPaths: true },
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
			prerender: {
				enabled: true,
				crawlLinks: true,
				failOnError: true,
			},
		}),
		viteReact(),
	],
});
