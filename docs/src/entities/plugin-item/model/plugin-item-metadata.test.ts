import { describe, expect, it } from "vitest";
import type { PluginItemLabel } from "./plugin-item-label";
import {
	isPluginItemBadge,
	PLUGIN_ITEM_BADGES,
	validatePluginItemMetadata,
} from "./plugin-item-metadata";

const WIDGET_LABEL: PluginItemLabel = {
	noun: "widget",
	indefinite: "un widget",
	definite: "le widget",
	possessive: "du widget",
};

describe("validatePluginItemMetadata", () => {
	it("lists the six badges a plugin item can carry", () => {
		expect(PLUGIN_ITEM_BADGES).toEqual([
			"project",
			"feature",
			"story",
			"lane",
			"review",
			"knowledge",
		]);
	});

	it("accepts only the six badges", () => {
		expect(isPluginItemBadge("project")).toBe(true);
		expect(isPluginItemBadge("projet")).toBe(false);
	});

	it("names the file, the key and the kind of item when a required key is missing", () => {
		expect(
			validatePluginItemMetadata(
				"widgets/a.md",
				{ "moukie-badge": "project", "moukie-icon": "rocket" },
				WIDGET_LABEL,
			),
		).toEqual([
			"widgets/a.md : moukie-summary manquant pour un widget « project »",
			"widgets/a.md : moukie-rank manquant pour un widget « project »",
		]);
	});

	it("names the file and the value of an unknown badge, an unknown icon and a rank that is not an integer", () => {
		expect(
			validatePluginItemMetadata(
				"widgets/a.md",
				{
					"moukie-badge": "projet",
					"moukie-icon": "Rocket",
					"moukie-rank": "un",
				},
				WIDGET_LABEL,
			),
		).toEqual([
			"widgets/a.md : moukie-badge « projet » inconnu, attendu l'un de project, feature, story, lane, review, knowledge",
			"widgets/a.md : moukie-icon « Rocket » n'est pas une icône Lucide",
			"widgets/a.md : moukie-rank « un » n'est pas un entier",
		]);
	});

	it("requires nothing but the badge of a knowledge item", () => {
		expect(
			validatePluginItemMetadata(
				"widgets/a.md",
				{ "moukie-badge": "knowledge" },
				WIDGET_LABEL,
			),
		).toEqual([]);
		expect(
			validatePluginItemMetadata("widgets/a.md", {}, WIDGET_LABEL),
		).toEqual(["widgets/a.md : moukie-badge manquant"]);
	});
});
