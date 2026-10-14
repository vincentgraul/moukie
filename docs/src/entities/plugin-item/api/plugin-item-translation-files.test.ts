import {
	mkdirSync,
	mkdtempSync,
	readdirSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { hashSourceText } from "@/shared/lib/index.server";
import { selectPluginItemCards } from "../model/plugin-item-card";
import { readPluginItemFiles } from "./plugin-item-files";
import type { PluginItemSource } from "./plugin-item-source";
import {
	checkPluginItemTranslations,
	localizePluginItemCards,
	readPluginItemTranslation,
} from "./plugin-item-translation-files";

const WIDGET_SOURCE: PluginItemSource = {
	label: {
		noun: "widget",
		indefinite: "un widget",
		definite: "le widget",
		possessive: "du widget",
	},
	directory: "widgets",
	pathPattern: "widgets/<nom>.md",
	listFilePaths: (pluginRoot) =>
		readdirSync(join(pluginRoot, "widgets"))
			.filter((name) => name.endsWith(".md"))
			.map((name) => `widgets/${name}`)
			.sort(),
};

const SUMMARY = "Cadre une feature et la découpe en stories.";
const PRODUCES = "Crée project/specs/";

const createdRoots: string[] = [];

function createPluginRoot(files: Readonly<Record<string, string>>) {
	const pluginRoot = mkdtempSync(join(tmpdir(), "moukie-translations-"));
	createdRoots.push(pluginRoot);
	for (const [relativePath, content] of Object.entries(files)) {
		const absolutePath = join(pluginRoot, relativePath);
		mkdirSync(dirname(absolutePath), { recursive: true });
		writeFileSync(absolutePath, content);
	}
	return pluginRoot;
}

function buildWidget(
	name: string,
	metadata: Readonly<Record<string, string>> = {
		"moukie-summary": SUMMARY,
		"moukie-produces": PRODUCES,
	},
) {
	return [
		"---",
		`name: ${name}`,
		"description: Un widget.",
		"metadata:",
		"  moukie-badge: story",
		"  moukie-icon: rocket",
		'  moukie-rank: "1"',
		...Object.entries(metadata).map(
			([key, value]) => `  ${key}: ${JSON.stringify(value)}`,
		),
		"---",
		"",
	].join("\n");
}

function buildTranslation(
	fields: Readonly<Record<string, { text: string; source: string }>> = {
		summary: {
			text: "Scopes a feature and splits it into stories.",
			source: SUMMARY,
		},
		produces: { text: "Creates project/specs/", source: PRODUCES },
	},
) {
	return JSON.stringify(
		Object.fromEntries(
			Object.entries(fields).map(([field, { text, source }]) => [
				field,
				{ text, sourceHash: hashSourceText(source) },
			]),
		),
	);
}

function readCards(pluginRoot: string) {
	return selectPluginItemCards(
		readPluginItemFiles(pluginRoot, WIDGET_SOURCE),
		WIDGET_SOURCE.label,
	);
}

afterEach(() => {
	for (const pluginRoot of createdRoots.splice(0)) {
		rmSync(pluginRoot, { recursive: true, force: true });
	}
});

describe("readPluginItemTranslation", () => {
	it("reads the English texts of an item with the fingerprint of the French text they translate", () => {
		const pluginRoot = createPluginRoot({
			"docs/content/en/widgets/spec.json": buildTranslation(),
		});

		expect(
			readPluginItemTranslation(
				pluginRoot,
				"docs/content/en/widgets/spec.json",
			),
		).toEqual({
			summary: {
				text: "Scopes a feature and splits it into stories.",
				sourceHash: hashSourceText(SUMMARY),
			},
			produces: {
				text: "Creates project/specs/",
				sourceHash: hashSourceText(PRODUCES),
			},
		});
		expect(
			readPluginItemTranslation(pluginRoot, "docs/content/en/widgets/pr.json"),
		).toBeUndefined();
	});

	it("rejects a translation that is not valid JSON or has an unknown or malformed field, naming its file", () => {
		const pluginRoot = createPluginRoot({
			"docs/content/en/widgets/a.json": "{",
			"docs/content/en/widgets/b.json": JSON.stringify({
				description: { text: "x", sourceHash: hashSourceText("x") },
			}),
			"docs/content/en/widgets/c.json": JSON.stringify({
				summary: { text: "x", sourceHash: "abc" },
			}),
			"docs/content/en/widgets/d.json": JSON.stringify(["summary"]),
		});

		for (const [name, message] of [
			["a", /a\.json : JSON illisible/],
			["b", /b\.json : champ « description » inconnu/],
			["c", /c\.json : summary doit porter/],
			["d", /d\.json : la traduction doit être un objet JSON/],
		] as const) {
			expect(() =>
				readPluginItemTranslation(
					pluginRoot,
					`docs/content/en/widgets/${name}.json`,
				),
			).toThrow(message);
		}
	});
});

describe("localizePluginItemCards", () => {
	it("chooses the French text from the plugin in French, and the versioned translation in English", () => {
		const pluginRoot = createPluginRoot({
			"widgets/spec.md": buildWidget("spec"),
			"docs/content/en/widgets/spec.json": buildTranslation(),
		});
		const cards = readCards(pluginRoot);

		expect(
			localizePluginItemCards(pluginRoot, cards, "fr", WIDGET_SOURCE),
		).toMatchObject([{ name: "spec", summary: SUMMARY, produces: PRODUCES }]);
		expect(
			localizePluginItemCards(pluginRoot, cards, "en", WIDGET_SOURCE),
		).toMatchObject([
			{
				name: "spec",
				summary: "Scopes a feature and splits it into stories.",
				produces: "Creates project/specs/",
			},
		]);
	});

	it("leaves out an English produces line when the French item produces nothing", () => {
		const pluginRoot = createPluginRoot({
			"widgets/pr.md": buildWidget("pr", { "moukie-summary": SUMMARY }),
			"docs/content/en/widgets/pr.json": buildTranslation(),
		});

		const [card] = localizePluginItemCards(
			pluginRoot,
			readCards(pluginRoot),
			"en",
			WIDGET_SOURCE,
		);

		expect(card).not.toHaveProperty("produces");
	});

	it("fails the build, naming the item, when an English translation or one of its fields is missing", () => {
		const withoutTranslation = createPluginRoot({
			"widgets/spec.md": buildWidget("spec"),
		});
		const withoutProduces = createPluginRoot({
			"widgets/spec.md": buildWidget("spec"),
			"docs/content/en/widgets/spec.json": buildTranslation({
				summary: { text: "Scopes a feature.", source: SUMMARY },
			}),
		});

		expect(() =>
			localizePluginItemCards(
				withoutTranslation,
				readCards(withoutTranslation),
				"en",
				WIDGET_SOURCE,
			),
		).toThrow(
			"docs/content/en/widgets/spec.json : traduction en absente pour le widget « spec »",
		);
		expect(() =>
			localizePluginItemCards(
				withoutProduces,
				readCards(withoutProduces),
				"en",
				WIDGET_SOURCE,
			),
		).toThrow(
			"docs/content/en/widgets/spec.json : produces manquant, le widget « spec » a un moukie-produces",
		);
	});
});

describe("checkPluginItemTranslations", () => {
	it("names a translation that no displayed item uses any more", () => {
		const pluginRoot = createPluginRoot({
			"widgets/spec.md": buildWidget("spec"),
			"widgets/helper.md": [
				"---",
				"name: helper",
				"description: Un widget de connaissance.",
				"metadata:",
				"  moukie-badge: knowledge",
				"---",
				"",
			].join("\n"),
			"docs/content/en/widgets/spec.json": buildTranslation(),
			"docs/content/en/widgets/helper.json": buildTranslation(),
			"docs/content/en/widgets/removed.json": buildTranslation(),
		});

		expect(
			checkPluginItemTranslations(pluginRoot, WIDGET_SOURCE, "en"),
		).toEqual([
			"docs/content/en/widgets/helper.json : aucun widget affiché ne s'appelle « helper »",
			"docs/content/en/widgets/removed.json : aucun widget affiché ne s'appelle « removed »",
		]);
	});

	it("leaves an item whose French metadata is invalid to the metadata check", () => {
		const pluginRoot = createPluginRoot({
			"widgets/spec.md": buildWidget("spec"),
			"widgets/broken.md": buildWidget("broken", {}),
			"docs/content/en/widgets/spec.json": buildTranslation(),
		});

		expect(
			checkPluginItemTranslations(pluginRoot, WIDGET_SOURCE, "en"),
		).toEqual([]);
	});

	it("names the file of a translation that cannot be read", () => {
		const pluginRoot = createPluginRoot({
			"widgets/spec.md": buildWidget("spec"),
			"docs/content/en/widgets/spec.json": "{",
		});

		expect(
			checkPluginItemTranslations(pluginRoot, WIDGET_SOURCE, "en"),
		).toEqual([
			expect.stringMatching(
				/^docs\/content\/en\/widgets\/spec\.json : JSON illisible/,
			),
		]);
	});
});
