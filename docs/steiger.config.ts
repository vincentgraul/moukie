import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
	...fsd.configs.recommended,
	{
		ignores: ["./src/app/routeTree.gen.ts", "./src/shared/i18n/paraglide/**"],
	},
]);
