import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
	AGENT_SOURCE,
	readPluginItemFiles,
	SKILL_SOURCE,
} from "@/entities/plugin-item/index.server";
import { findPluginRoot } from "@/shared/api/index.server";
import { checkPluginMetadata } from "./plugin-metadata";

const VALID_METADATA = [
	"  moukie-badge: project",
	"  moukie-icon: rocket",
	'  moukie-rank: "1"',
	"  moukie-summary: Mène l'entretien de départ.",
];

const createdRoots: string[] = [];

function createPluginRoot(files: Readonly<Record<string, string>>) {
	const pluginRoot = mkdtempSync(join(tmpdir(), "moukie-plugin-"));
	createdRoots.push(pluginRoot);
	for (const [relativePath, content] of Object.entries(files)) {
		const absolutePath = join(pluginRoot, relativePath);
		mkdirSync(dirname(absolutePath), { recursive: true });
		writeFileSync(absolutePath, content);
	}
	return pluginRoot;
}

function buildFile(name: string, metadataLines: readonly string[]) {
	const metadata =
		metadataLines.length > 0 ? ["metadata:", ...metadataLines] : [];
	return [
		"---",
		`name: ${name}`,
		"description: Fait quelque chose : une description avec deux-points.",
		...metadata,
		"---",
		"",
		`# ${name}`,
		"",
	].join("\n");
}

function withoutKey(key: string) {
	return VALID_METADATA.filter(
		(line) => !line.trimStart().startsWith(`${key}:`),
	);
}

function withValue(key: string, value: string) {
	return [...withoutKey(key), `  ${key}: ${value}`];
}

const VALID_SKILL = {
	"skills/spec/SKILL.md": buildFile("spec", VALID_METADATA),
};

const VALID_AGENT = {
	"agents/reviewer.md": buildFile(
		"reviewer",
		withValue("moukie-badge", "review"),
	),
};

afterEach(() => {
	for (const pluginRoot of createdRoots.splice(0)) {
		rmSync(pluginRoot, { recursive: true, force: true });
	}
});

describe("checkPluginMetadata", () => {
	it("`bun run check` fails, naming the faulty file, when a skill or an agent has no `moukie-badge`.", () => {
		const pluginRoot = createPluginRoot({
			"skills/setup/SKILL.md": buildFile("setup", withoutKey("moukie-badge")),
			"skills/pr/SKILL.md": buildFile("pr", []),
			"agents/reviewer.md": buildFile("reviewer", withoutKey("moukie-badge")),
		});

		const errors = checkPluginMetadata(pluginRoot);

		expect(errors).toHaveLength(3);
		expect(errors).toContainEqual(
			expect.stringContaining("skills/setup/SKILL.md"),
		);
		expect(errors).toContainEqual(
			expect.stringContaining("skills/pr/SKILL.md"),
		);
		expect(errors).toContainEqual(
			expect.stringContaining("agents/reviewer.md"),
		);
		for (const error of errors) {
			expect(error).toContain("moukie-badge");
		}
	});

	it("`bun run check` fails, naming the file and the key, when an item that is not `knowledge` has no `moukie-summary`, `moukie-icon` or `moukie-rank`.", () => {
		for (const key of ["moukie-summary", "moukie-icon", "moukie-rank"]) {
			const pluginRoot = createPluginRoot({
				"skills/setup/SKILL.md": buildFile("setup", withoutKey(key)),
				"agents/backend.md": buildFile("backend", withoutKey(key)),
			});

			const errors = checkPluginMetadata(pluginRoot);

			expect(errors).toHaveLength(2);
			expect(errors).toContainEqual(
				expect.stringMatching(new RegExp(`skills/setup/SKILL\\.md.*${key}`)),
			);
			expect(errors).toContainEqual(
				expect.stringMatching(new RegExp(`agents/backend\\.md.*${key}`)),
			);
		}
	});

	it("`bun run check` fails, naming the file and the value, when `moukie-badge` is not one of `project`, `feature`, `story`, `lane`, `review`, `knowledge`.", () => {
		const pluginRoot = createPluginRoot({
			"skills/setup/SKILL.md": buildFile(
				"setup",
				withValue("moukie-badge", "projet"),
			),
			"agents/reviewer.md": buildFile(
				"reviewer",
				withValue("moukie-badge", "reviewer"),
			),
		});

		const errors = checkPluginMetadata(pluginRoot);

		expect(errors).toHaveLength(2);
		expect(errors).toContainEqual(
			expect.stringMatching(/skills\/setup\/SKILL\.md.*projet/),
		);
		expect(errors).toContainEqual(
			expect.stringMatching(/agents\/reviewer\.md.*reviewer/),
		);
	});

	it("`bun run check` fails, naming the file and the value, when `moukie-icon` is not a Lucide icon.", () => {
		const pluginRoot = createPluginRoot({
			"skills/setup/SKILL.md": buildFile(
				"setup",
				withValue("moukie-icon", "Rocket"),
			),
			"agents/front-web.md": buildFile(
				"front-web",
				withValue("moukie-icon", "not-a-lucide-icon"),
			),
		});

		const errors = checkPluginMetadata(pluginRoot);

		expect(errors).toHaveLength(2);
		expect(errors).toContainEqual(
			expect.stringMatching(/skills\/setup\/SKILL\.md.*Rocket/),
		);
		expect(errors).toContainEqual(
			expect.stringMatching(/agents\/front-web\.md.*not-a-lucide-icon/),
		);
	});

	it("fails, naming the file and the value, when `moukie-rank` is not an integer", () => {
		const pluginRoot = createPluginRoot({
			...VALID_AGENT,
			"skills/setup/SKILL.md": buildFile(
				"setup",
				withValue("moukie-rank", "premier"),
			),
		});

		expect(checkPluginMetadata(pluginRoot)).toEqual([
			expect.stringMatching(/skills\/setup\/SKILL\.md.*moukie-rank.*premier/),
		]);
	});

	it("fails, naming the file, when its frontmatter cannot be read", () => {
		const pluginRoot = createPluginRoot({
			...VALID_SKILL,
			"agents/backend.md": "# backend\n",
		});

		expect(checkPluginMetadata(pluginRoot)).toEqual([
			expect.stringContaining("agents/backend.md"),
		]);
	});

	it("fails with an explicit message when the `skills/` or `agents/` folder is missing", () => {
		const withoutSkills = createPluginRoot(VALID_AGENT);
		const withoutAgents = createPluginRoot(VALID_SKILL);

		expect(checkPluginMetadata(withoutSkills)).toEqual([
			expect.stringMatching(/skills\/.*absent/),
		]);
		expect(checkPluginMetadata(withoutAgents)).toEqual([
			expect.stringMatching(/agents\/.*absent/),
		]);
	});

	it("fails with an explicit message when no skill or no agent is found", () => {
		const withoutSkill = createPluginRoot({
			...VALID_AGENT,
			"skills/notes.md": "# notes\n",
			"skills/empty/README.md": "# empty\n",
		});
		const withoutAgent = createPluginRoot({
			...VALID_SKILL,
			"agents/notes.txt": "notes\n",
		});

		expect(checkPluginMetadata(withoutSkill)).toEqual([
			expect.stringMatching(/skills\/.*aucun skill/),
		]);
		expect(checkPluginMetadata(withoutAgent)).toEqual([
			expect.stringMatching(/agents\/.*aucun agent/),
		]);
	});

	it("passes on complete metadata and on a `knowledge` item that only has its badge", () => {
		const pluginRoot = createPluginRoot({
			"skills/setup/SKILL.md": buildFile("setup", VALID_METADATA),
			"skills/naming-conventions/SKILL.md": buildFile("naming-conventions", [
				"  moukie-badge: knowledge",
			]),
			"agents/backend.md": buildFile("backend", [
				...withValue("moukie-badge", "lane"),
				"  moukie-produces: Écrit le code serveur.",
			]),
		});

		expect(checkPluginMetadata(pluginRoot)).toEqual([]);
	});

	it("`bun run check` passes on the repository once the metadata is added.", () => {
		expect(checkPluginMetadata(findPluginRoot())).toEqual([]);
	});

	it("finds the 14 skills and the 4 agents of the repository, each with a `name` equal to the name of its folder or file", () => {
		const pluginRoot = findPluginRoot();
		const skillFiles = readPluginItemFiles(pluginRoot, SKILL_SOURCE);
		const agentFiles = readPluginItemFiles(pluginRoot, AGENT_SOURCE);

		expect(skillFiles).toHaveLength(14);
		expect(agentFiles).toHaveLength(4);
		for (const file of skillFiles) {
			expect(file.path).toBe(`skills/${file.frontmatter.name}/SKILL.md`);
		}
		for (const file of agentFiles) {
			expect(file.path).toBe(`agents/${file.frontmatter.name}.md`);
		}
	});
});
