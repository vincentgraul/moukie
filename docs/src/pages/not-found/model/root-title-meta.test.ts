import { describe, expect, it } from "vitest";
import { createRootTitleMeta } from "./root-title-meta";

describe("createRootTitleMeta", () => {
	it("titles an unknown URL in French, the language of the 404 that GitHub Pages serves", () => {
		expect(createRootTitleMeta(true)).toEqual([
			{ title: "Page introuvable · Moukie" },
		]);
	});

	it("titles any other page with the name of the site", () => {
		expect(createRootTitleMeta(false)).toEqual([{ title: "Moukie" }]);
	});
});
