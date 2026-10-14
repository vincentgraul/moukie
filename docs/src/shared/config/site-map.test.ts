import { describe, expect, it } from "vitest";
import { isSitePage, toPagePath } from "./site-map";

describe("site map", () => {
	it("knows which pages exist", () => {
		expect(isSitePage("skills")).toBe(true);
		expect(isSitePage("agents")).toBe(false);
	});

	it("builds page paths that end with a slash, as GitHub Pages serves them", () => {
		expect(toPagePath("fr")).toBe("/fr/");
		expect(toPagePath("fr", "skills")).toBe("/fr/skills/");
	});
});
