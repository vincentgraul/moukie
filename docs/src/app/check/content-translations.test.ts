import { spawnSync } from "node:child_process";
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
	AGENT_SOURCE,
	readPluginItemFiles,
	SKILL_SOURCE,
} from "@/entities/plugin-item/index.server";
import { getPluginMetadata, type PluginFile } from "@/shared/api";
import { findPluginRoot } from "@/shared/api/index.server";
import { hashSourceText } from "@/shared/lib/index.server";
import { checkContentTranslations } from "./content-translations";

const SKILL_SUMMARY = "Cadre une feature et la découpe en stories.";
const SKILL_PRODUCES = "Crée project/specs/";
const AGENT_SUMMARY = "Relit toute la story avant la PR, sans rien corriger.";

const RUN_CHECK_SCRIPT = resolve(import.meta.dirname, "run-plugin-check.ts");

const createdRoots: string[] = [];

type FrenchTexts = { readonly summary: string; readonly produces?: string };

type EnglishField = { readonly text: string; readonly source: string };

function buildPluginFile(
	name: string,
	badge: string,
	{ summary, produces }: FrenchTexts,
) {
	return [
		"---",
		`name: ${name}`,
		"description: Un élément de test.",
		"metadata:",
		`  moukie-badge: ${badge}`,
		"  moukie-icon: rocket",
		'  moukie-rank: "1"',
		`  moukie-summary: ${JSON.stringify(summary)}`,
		...(produces === undefined
			? []
			: [`  moukie-produces: ${JSON.stringify(produces)}`]),
		"---",
		"",
	].join("\n");
}

function buildTranslation(
	fields: Readonly<Record<string, EnglishField | undefined>>,
) {
	return JSON.stringify(
		Object.fromEntries(
			Object.entries(fields)
				.filter(
					(entry): entry is [string, EnglishField] => entry[1] !== undefined,
				)
				.map(([field, { text, source }]) => [
					field,
					{ text, sourceHash: hashSourceText(source) },
				]),
		),
	);
}

const UP_TO_DATE_SKILL_TRANSLATION = buildTranslation({
	summary: {
		text: "Scopes a feature and splits it into stories.",
		source: SKILL_SUMMARY,
	},
	produces: { text: "Creates project/specs/", source: SKILL_PRODUCES },
});

const UP_TO_DATE_AGENT_TRANSLATION = buildTranslation({
	summary: {
		text: "Reviews the whole story before the PR, without fixing anything.",
		source: AGENT_SUMMARY,
	},
});

type PluginFixture = {
	readonly skill?: FrenchTexts;
	readonly agent?: FrenchTexts;
	readonly skillTranslation?: string;
	readonly agentTranslation?: string;
};

function createPluginRoot({
	skill = { summary: SKILL_SUMMARY, produces: SKILL_PRODUCES },
	agent = { summary: AGENT_SUMMARY },
	skillTranslation = UP_TO_DATE_SKILL_TRANSLATION,
	agentTranslation = UP_TO_DATE_AGENT_TRANSLATION,
}: PluginFixture = {}) {
	const pluginRoot = mkdtempSync(join(tmpdir(), "moukie-content-"));
	createdRoots.push(pluginRoot);
	const files: Record<string, string> = {
		".claude-plugin/plugin.json": "{}",
		"skills/spec/SKILL.md": buildPluginFile("spec", "feature", skill),
		"skills/naming-conventions/SKILL.md": [
			"---",
			"name: naming-conventions",
			"description: Un skill de connaissance.",
			"metadata:",
			"  moukie-badge: knowledge",
			"---",
			"",
		].join("\n"),
		"agents/reviewer.md": buildPluginFile("reviewer", "review", agent),
	};
	if (skillTranslation !== "") {
		files["docs/content/en/skills/spec.json"] = skillTranslation;
	}
	if (agentTranslation !== "") {
		files["docs/content/en/agents/reviewer.json"] = agentTranslation;
	}
	for (const [relativePath, content] of Object.entries(files)) {
		const absolutePath = join(pluginRoot, relativePath);
		mkdirSync(dirname(absolutePath), { recursive: true });
		writeFileSync(absolutePath, content);
	}
	return pluginRoot;
}

function runCheckCommand(pluginRoot: string) {
	return spawnSync("bun", [RUN_CHECK_SCRIPT], {
		cwd: pluginRoot,
		encoding: "utf8",
	});
}

function readDisplayedItems(files: readonly PluginFile[], directory: string) {
	return files
		.map((file) => ({
			name: String(file.frontmatter.name),
			metadata: getPluginMetadata(file) ?? {},
			translationPath: `docs/content/en/${directory}/${file.frontmatter.name}.json`,
		}))
		.filter(({ metadata }) => metadata["moukie-badge"] !== "knowledge");
}

afterEach(() => {
	for (const pluginRoot of createdRoots.splice(0)) {
		rmSync(pluginRoot, { recursive: true, force: true });
	}
});

describe("checkContentTranslations", () => {
	it("Each displayed skill and agent has its English translation versioned in the repository, with the fingerprint of the French text it translates.", () => {
		const pluginRoot = findPluginRoot();
		const items = [
			...readDisplayedItems(
				readPluginItemFiles(pluginRoot, SKILL_SOURCE),
				"skills",
			),
			...readDisplayedItems(
				readPluginItemFiles(pluginRoot, AGENT_SOURCE),
				"agents",
			),
		];

		expect(items).toHaveLength(15);
		for (const { name, metadata, translationPath } of items) {
			const absolutePath = join(pluginRoot, translationPath);
			expect(existsSync(absolutePath), translationPath).toBe(true);
			const translation = JSON.parse(readFileSync(absolutePath, "utf8"));
			expect(translation.summary.text, name).not.toBe(
				metadata["moukie-summary"],
			);
			expect(translation.summary.sourceHash, name).toBe(
				hashSourceText(metadata["moukie-summary"]),
			);
			if (metadata["moukie-produces"]) {
				expect(translation.produces.sourceHash, name).toBe(
					hashSourceText(metadata["moukie-produces"]),
				);
			} else {
				expect(translation, name).not.toHaveProperty("produces");
			}
		}
	});

	it("`bun run check` fails, naming the item, when a displayed skill or agent has no English translation.", () => {
		const pluginRoot = createPluginRoot({
			skillTranslation: "",
			agentTranslation: "",
		});

		expect(checkContentTranslations(pluginRoot)).toEqual([
			"docs/content/en/skills/spec.json : traduction en absente pour le skill « spec »",
			"docs/content/en/agents/reviewer.json : traduction en absente pour l'agent « reviewer »",
		]);
		const result = runCheckCommand(pluginRoot);
		expect(result.status).toBe(1);
		expect(result.stderr).toContain("« spec »");
		expect(result.stderr).toContain("« reviewer »");
	});

	it("`bun run check` fails, naming the item, when its French `moukie-summary` or `moukie-produces` has changed since its translation.", () => {
		const changedSummary = createPluginRoot({
			skill: {
				summary: "Cadre une feature et la découpe en petites stories.",
				produces: SKILL_PRODUCES,
			},
			agent: { summary: "Relit la story avant la PR, sans rien corriger." },
		});
		const changedProduces = createPluginRoot({
			skill: {
				summary: SKILL_SUMMARY,
				produces: "Crée project/specs/<feature>/",
			},
		});

		expect(checkContentTranslations(changedSummary)).toEqual([
			"docs/content/en/skills/spec.json : moukie-summary du skill « spec » a changé depuis sa traduction",
			"docs/content/en/agents/reviewer.json : moukie-summary de l'agent « reviewer » a changé depuis sa traduction",
		]);
		expect(checkContentTranslations(changedProduces)).toEqual([
			"docs/content/en/skills/spec.json : moukie-produces du skill « spec » a changé depuis sa traduction",
		]);
		const result = runCheckCommand(changedProduces);
		expect(result.status).toBe(1);
		expect(result.stderr).toContain(
			"moukie-produces du skill « spec » a changé depuis sa traduction",
		);
	});

	it("`bun run check` fails, naming the item, when a translation has a field too many or too few compared to the French", () => {
		const missingField = createPluginRoot({
			skillTranslation: buildTranslation({
				summary: { text: "Scopes a feature.", source: SKILL_SUMMARY },
			}),
		});
		const extraField = createPluginRoot({
			agentTranslation: buildTranslation({
				summary: {
					text: "Reviews the whole story.",
					source: AGENT_SUMMARY,
				},
				produces: { text: "Reports findings", source: "Rend des constats" },
			}),
		});

		expect(checkContentTranslations(missingField)).toEqual([
			"docs/content/en/skills/spec.json : produces manquant, le skill « spec » a un moukie-produces",
		]);
		expect(checkContentTranslations(extraField)).toEqual([
			"docs/content/en/agents/reviewer.json : produces en trop, l'agent « reviewer » n'a pas de moukie-produces",
		]);
		expect(runCheckCommand(extraField).status).toBe(1);
	});

	it("`bun run check` passes when every translation is up to date.", () => {
		const pluginRoot = createPluginRoot();

		expect(checkContentTranslations(pluginRoot)).toEqual([]);
		expect(checkContentTranslations(findPluginRoot())).toEqual([]);
		const result = runCheckCommand(pluginRoot);
		expect(result.stderr).toBe("");
		expect(result.status).toBe(0);
		expect(result.stdout).toContain("Traductions du contenu du plugin à jour.");
	});
});
