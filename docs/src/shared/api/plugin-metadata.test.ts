import { describe, expect, it } from "vitest";
import {
	isPluginItemBadge,
	PLUGIN_BADGES,
	type PluginItemKind,
	validatePluginMetadata,
} from "./plugin-metadata";

const WIDGET_KIND: PluginItemKind<"project" | "knowledge"> = {
	noun: "widget",
	badges: ["project", "knowledge"],
};

describe("validatePluginMetadata", () => {
	it("lists the six badges a plugin item can carry", () => {
		expect(PLUGIN_BADGES).toEqual([
			"project",
			"feature",
			"story",
			"lane",
			"review",
			"knowledge",
		]);
	});

	it("accepts only the badges of the given kind", () => {
		expect(isPluginItemBadge(WIDGET_KIND, "project")).toBe(true);
		expect(isPluginItemBadge(WIDGET_KIND, "story")).toBe(false);
	});

	it("names the file, the key and the kind of item when a required key is missing", () => {
		expect(
			validatePluginMetadata(
				"widgets/a.md",
				{ "moukie-badge": "project", "moukie-icon": "rocket" },
				WIDGET_KIND,
			),
		).toEqual([
			"widgets/a.md : moukie-summary manquant pour un widget « project »",
			"widgets/a.md : moukie-rank manquant pour un widget « project »",
		]);
	});

	it("names the file and the value of an unknown badge, an unknown icon and a rank that is not an integer", () => {
		expect(
			validatePluginMetadata(
				"widgets/a.md",
				{
					"moukie-badge": "story",
					"moukie-icon": "Rocket",
					"moukie-rank": "un",
				},
				WIDGET_KIND,
			),
		).toEqual([
			"widgets/a.md : moukie-badge « story » inconnu, attendu l'un de project, knowledge",
			"widgets/a.md : moukie-icon « Rocket » n'est pas une icône Lucide",
			"widgets/a.md : moukie-rank « un » n'est pas un entier",
		]);
	});

	it("requires nothing but the badge of a knowledge item", () => {
		expect(
			validatePluginMetadata(
				"widgets/a.md",
				{ "moukie-badge": "knowledge" },
				WIDGET_KIND,
			),
		).toEqual([]);
		expect(validatePluginMetadata("widgets/a.md", {}, WIDGET_KIND)).toEqual([
			"widgets/a.md : moukie-badge manquant",
		]);
	});
});
