import { describe, expect, it } from "vitest";
import { getBadgeLabel } from "./badge-label";

describe("getBadgeLabel", () => {
	it("gives the French label of each displayed badge", () => {
		expect(
			(["project", "feature", "story", "lane", "review"] as const).map(
				(badge) => getBadgeLabel(badge, "fr"),
			),
		).toEqual(["Projet", "Feature", "Story", "Lane", "Review"]);
	});
});
