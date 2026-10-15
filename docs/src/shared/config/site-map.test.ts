import { describe, expect, it } from "vitest";
import { isSitePage, toPagePath } from "./site-map";

describe("site map", () => {
	it("knows which pages exist", () => {
		expect(isSitePage("getting-started")).toBe(true);
		expect(isSitePage("skills")).toBe(true);
		expect(isSitePage("agents")).toBe(true);
		expect(isSitePage("workflow-map")).toBe(false);
	});

	it("builds page paths that end with a slash, as GitHub Pages serves them", () => {
		expect(toPagePath("fr")).toBe("/fr/");
		expect(toPagePath("fr", "getting-started")).toBe("/fr/getting-started/");
		expect(toPagePath("fr", "skills")).toBe("/fr/skills/");
		expect(toPagePath("fr", "agents")).toBe("/fr/agents/");
	});
});
