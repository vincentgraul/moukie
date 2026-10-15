import { describe, expect, it } from "vitest";
import { isSitePage } from "@/shared/config";
import { NAVIGATION_ENTRIES } from "./navigation";

describe("navigation entries", () => {
	it("La barre latérale affiche le logo, « Moukie », puis les entrées Getting started, Skills, Agents et Workflow map, avec leurs icônes.", () => {
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

	it("Une entrée dont la page n'existe pas encore est affichée désactivée et n'est pas cliquable : Workflow map.", () => {
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
