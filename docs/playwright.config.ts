import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e",
	use: {
		baseURL: "http://localhost:3000/moukie/",
	},
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
	webServer: {
		command: "bun run build && bun e2e/static-server.ts",
		url: "http://localhost:3000/moukie/",
		reuseExistingServer: !process.env.CI,
	},
});
