import { describe, expect, it } from "vitest";
import { selectPluginCards, toPluginCard } from "./plugin-card";
import type { PluginFile, PluginMetadata } from "./plugin-file";
import type { PluginItemKind } from "./plugin-metadata";

const WIDGET_KIND: PluginItemKind<"story" | "knowledge"> = {
	noun: "widget",
	badges: ["story", "knowledge"],
};

function createWidgetFile(name: string, metadata: PluginMetadata): PluginFile {
	return {
		path: `widgets/${name}.md`,
		frontmatter: { name, description: `${name} description`, metadata },
	};
}

function createDisplayedWidgetFile(
	name: string,
	rank: string,
	extraMetadata: PluginMetadata = {},
) {
	return createWidgetFile(name, {
		"moukie-badge": "story",
		"moukie-icon": "rocket",
		"moukie-rank": rank,
		"moukie-summary": `Résumé de ${name}.`,
		...extraMetadata,
	});
}

describe("toPluginCard", () => {
	it("reads the card of a displayed item, with what it produces only when it is filled in", () => {
		expect(
			toPluginCard(
				createDisplayedWidgetFile("spec", "6", {
					"moukie-produces": "Crée project/specs/",
				}),
				WIDGET_KIND,
			),
		).toEqual({
			name: "spec",
			badge: "story",
			iconName: "rocket",
			rank: 6,
			summary: "Résumé de spec.",
			produces: "Crée project/specs/",
		});
		expect(
			toPluginCard(
				createDisplayedWidgetFile("pr", "9", { "moukie-produces": "" }),
				WIDGET_KIND,
			),
		).not.toHaveProperty("produces");
	});

	it("gives no card to a knowledge item", () => {
		expect(
			toPluginCard(
				createWidgetFile("helper", { "moukie-badge": "knowledge" }),
				WIDGET_KIND,
			),
		).toBeUndefined();
	});

	it("rejects an item whose metadata is invalid, naming its file", () => {
		expect(() =>
			toPluginCard(createDisplayedWidgetFile("broken", "un"), WIDGET_KIND),
		).toThrow("widgets/broken.md : moukie-rank « un » n'est pas un entier");
	});

	it("rejects an item without a name, naming its file", () => {
		const file = createDisplayedWidgetFile("", "1");

		expect(() => toPluginCard(file, WIDGET_KIND)).toThrow(
			"widgets/.md : name manquant",
		);
	});
});

describe("selectPluginCards", () => {
	it("sorts the displayed cards by numeric rank, then by name, and leaves out knowledge items", () => {
		const files = [
			createDisplayedWidgetFile("zeta", "2"),
			createDisplayedWidgetFile("beta", "10"),
			createWidgetFile("helper", { "moukie-badge": "knowledge" }),
			createDisplayedWidgetFile("alpha", "2"),
			createDisplayedWidgetFile("gamma", "1"),
		];

		expect(
			selectPluginCards(files, WIDGET_KIND).map((card) => card.name),
		).toEqual(["gamma", "alpha", "zeta", "beta"]);
	});
});
