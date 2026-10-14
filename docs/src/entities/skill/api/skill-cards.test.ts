import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { findPluginRoot } from "@/shared/api/index.server";
import { renderLucideIconMarkup } from "@/shared/lib/index.server";
import { loadSkillCardViews, readSkillCards } from "./skill-cards";

const createdDirectories: string[] = [];

function createPluginRoot() {
	const pluginRoot = mkdtempSync(join(tmpdir(), "moukie-skill-cards-"));
	createdDirectories.push(pluginRoot);
	mkdirSync(join(pluginRoot, ".claude-plugin"));
	writeFileSync(join(pluginRoot, ".claude-plugin", "plugin.json"), "{}");
	return pluginRoot;
}

function writeSkill(pluginRoot: string, name: string, summary: string) {
	mkdirSync(join(pluginRoot, "skills", name), { recursive: true });
	writeFileSync(
		join(pluginRoot, "skills", name, "SKILL.md"),
		[
			"---",
			`name: ${name}`,
			"description: Un skill de test.",
			"metadata:",
			'  moukie-badge: "project"',
			'  moukie-icon: "rocket"',
			'  moukie-rank: "1"',
			`  moukie-summary: "${summary}"`,
			"---",
			"",
			"# Skill",
		].join("\n"),
	);
}

afterEach(() => {
	for (const directory of createdDirectories.splice(0)) {
		rmSync(directory, { recursive: true, force: true });
	}
});

describe("readSkillCards", () => {
	it("La page affiche une carte par skill du plugin dont le badge n'est pas `knowledge`, soit 9 aujourd'hui.", () => {
		const cards = readSkillCards(findPluginRoot(), "fr");

		expect(cards.map((card) => card.name)).toEqual([
			"setup",
			"product",
			"stack",
			"architecture",
			"scaffold",
			"spec",
			"orchestrator",
			"contract",
			"pr",
		]);
	});

	it("Modifier le `moukie-summary` d'un skill dans le plugin change sa carte au build suivant, sans modifier le code du site.", () => {
		const pluginRoot = createPluginRoot();
		writeSkill(pluginRoot, "setup", "Premier résumé.");
		const firstBuild = readSkillCards(pluginRoot, "fr");

		writeSkill(pluginRoot, "setup", "Résumé modifié.");
		const nextBuild = readSkillCards(pluginRoot, "fr");

		expect(firstBuild[0].summary).toBe("Premier résumé.");
		expect(nextBuild[0].summary).toBe("Résumé modifié.");
	});
});

describe("loadSkillCardViews", () => {
	it("adds the rendered svg of its Lucide icon to each card", async () => {
		const pluginRoot = createPluginRoot();
		writeSkill(pluginRoot, "setup", "Un résumé.");

		const [view] = await loadSkillCardViews(pluginRoot, "fr");

		expect(view).toMatchObject({ name: "setup", iconName: "rocket" });
		expect(view.iconMarkup).toBe(await renderLucideIconMarkup("rocket"));
		expect(view.iconMarkup).toContain('class="lucide lucide-rocket"');
	});
});

describe("readSkillCards in English", () => {
	it("reads the English summary and produces of each displayed skill from its versioned translation", () => {
		const frenchCards = readSkillCards(findPluginRoot(), "fr");
		const englishCards = readSkillCards(findPluginRoot(), "en");

		expect(englishCards.map((card) => card.name)).toEqual(
			frenchCards.map((card) => card.name),
		);
		expect(englishCards[0]).toMatchObject({
			name: "setup",
			badge: "project",
			iconName: "rocket",
			summary: "Runs the kickoff interview and sets up the whole workflow.",
			produces: "Creates project/ and CLAUDE.md",
		});
		for (const [index, card] of englishCards.entries()) {
			expect(card.summary, card.name).not.toBe(frenchCards[index].summary);
			expect(card.produces === undefined, card.name).toBe(
				frenchCards[index].produces === undefined,
			);
		}
	});
});
