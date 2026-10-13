import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { readAgentFiles } from "@/entities/agent";
import { readSkillFiles } from "@/entities/skill";
import { PLUGIN_ROOT } from "@/shared/config";
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

afterEach(() => {
	for (const pluginRoot of createdRoots.splice(0)) {
		rmSync(pluginRoot, { recursive: true, force: true });
	}
});

describe("checkPluginMetadata", () => {
	it("`bun run check` échoue en nommant le fichier fautif quand un skill ou un agent n'a pas de `moukie-badge`.", () => {
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

	it("`bun run check` échoue en nommant le fichier et la clé quand un élément qui n'est pas `knowledge` n'a pas de `moukie-summary`, de `moukie-icon` ou de `moukie-rank`.", () => {
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

	it("`bun run check` échoue en nommant le fichier et la valeur quand `moukie-badge` n'est pas l'un de `project`, `feature`, `story`, `lane`, `review`, `knowledge`.", () => {
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

	it("`bun run check` échoue en nommant le fichier et la valeur quand `moukie-icon` n'est pas une icône Lucide.", () => {
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

	it("names the file and the value when moukie-rank is not an integer", () => {
		const pluginRoot = createPluginRoot({
			"skills/setup/SKILL.md": buildFile(
				"setup",
				withValue("moukie-rank", "premier"),
			),
		});

		expect(checkPluginMetadata(pluginRoot)).toEqual([
			expect.stringMatching(/skills\/setup\/SKILL\.md.*moukie-rank.*premier/),
		]);
	});

	it("names the file when its frontmatter cannot be read", () => {
		const pluginRoot = createPluginRoot({
			"agents/backend.md": "# backend\n",
		});

		expect(checkPluginMetadata(pluginRoot)).toEqual([
			expect.stringContaining("agents/backend.md"),
		]);
	});

	it("passes on complete metadata and on knowledge items with a badge only", () => {
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

	it("`bun run check` passe sur le dépôt une fois les métadonnées ajoutées.", () => {
		expect(checkPluginMetadata(PLUGIN_ROOT)).toEqual([]);
	});

	it("Chargé depuis le dépôt, le plugin expose toujours ses 12 skills et ses 4 agents dans Claude Code.", () => {
		const skillFiles = readSkillFiles(PLUGIN_ROOT);
		const agentFiles = readAgentFiles(PLUGIN_ROOT);

		expect(skillFiles).toHaveLength(12);
		expect(agentFiles).toHaveLength(4);
		for (const file of skillFiles) {
			expect(file.path).toBe(`skills/${file.frontmatter.name}/SKILL.md`);
			expect(file.frontmatter.description, file.path).toEqual(
				expect.any(String),
			);
		}
		for (const file of agentFiles) {
			expect(file.path).toBe(`agents/${file.frontmatter.name}.md`);
			expect(file.frontmatter.description, file.path).toEqual(
				expect.any(String),
			);
		}
	});
});
