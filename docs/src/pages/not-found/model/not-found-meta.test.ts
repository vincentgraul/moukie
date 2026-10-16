import { describe, expect, it } from "vitest";
import { createNotFoundMeta } from "./not-found-meta";

describe("createNotFoundMeta", () => {
	it("titles the tab in the language of the page and asks not to index it", () => {
		expect(createNotFoundMeta("fr")).toEqual([
			{ title: "Page introuvable · Moukie" },
			{ name: "robots", content: "noindex" },
		]);
		expect(createNotFoundMeta("en")).toEqual([
			{ title: "Page not found · Moukie" },
			{ name: "robots", content: "noindex" },
		]);
	});
});
