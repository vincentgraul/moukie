import { describe, expect, it } from "vitest";
import { isSitePage } from "@/shared/config";
import { NAVIGATION_ENTRIES } from "./navigation";

describe("navigation entries", () => {
	it("The sidebar shows the logo, “Moukie”, then the Getting started, Skills, Agents and Workflow map entries, with their icons.", () => {
		expect(NAVIGATION_ENTRIES.map((entry) => entry.label("fr"))).toEqual([
			"Getting started",
			"Skills",
			"Agents",
			"Workflow map",
		]);
		for (const entry of NAVIGATION_ENTRIES) {
			expect(entry.icon, entry.page).toBeDefined();
		}
	});

	it("An entry whose page does not exist yet is shown disabled and is not clickable: Workflow map.", () => {
		const entriesWithoutPage = NAVIGATION_ENTRIES.filter(
			(entry) => !isSitePage(entry.page),
		).map((entry) => entry.page);

		expect(entriesWithoutPage).toEqual(["workflow-map"]);
	});

	it("gives the Agents entry its label and a page of the site", () => {
		const agentsEntry = NAVIGATION_ENTRIES.find(
			(entry) => entry.page === "agents",
		);

		expect(agentsEntry?.label("fr")).toBe("Agents");
		expect(isSitePage("agents")).toBe(true);
	});
});
