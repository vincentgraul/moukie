import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { findPluginRoot } from "@/shared/api/index.server";
import { renderLucideIconMarkup } from "@/shared/lib/index.server";
import {
	loadPluginItemCardViews,
	readPluginItemCards,
} from "./plugin-item-cards";
import { AGENT_SOURCE, SKILL_SOURCE } from "./plugin-item-source";

const createdDirectories: string[] = [];

function createPluginRoot() {
	const pluginRoot = mkdtempSync(join(tmpdir(), "moukie-plugin-item-cards-"));
	createdDirectories.push(pluginRoot);
	mkdirSync(join(pluginRoot, ".claude-plugin"));
	writeFileSync(join(pluginRoot, ".claude-plugin", "plugin.json"), "{}");
	mkdirSync(join(pluginRoot, "agents"));
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

function writeAgent(pluginRoot: string, name: string, summary: string) {
	writeFileSync(
		join(pluginRoot, "agents", `${name}.md`),
		[
			"---",
			`name: ${name}`,
			"description: Un agent de test.",
			"metadata:",
			'  moukie-badge: "lane"',
			'  moukie-icon: "server"',
			'  moukie-rank: "1"',
			`  moukie-summary: "${summary}"`,
			"---",
			"",
			"# Agent",
		].join("\n"),
	);
}

afterEach(() => {
	for (const directory of createdDirectories.splice(0)) {
		rmSync(directory, { recursive: true, force: true });
	}
});

describe("readPluginItemCards for skills", () => {
	it("The page shows one card per plugin skill whose badge is not `knowledge`, 11 today.", () => {
		const cards = readPluginItemCards(findPluginRoot(), SKILL_SOURCE, "fr");

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
			"next",
			"idea",
		]);
	});

	it("Changing a skill's `moukie-summary` in the plugin changes its card at the next build, without changing the site's code.", () => {
		const pluginRoot = createPluginRoot();
		writeSkill(pluginRoot, "setup", "Premier résumé.");
		const firstBuild = readPluginItemCards(pluginRoot, SKILL_SOURCE, "fr");

		writeSkill(pluginRoot, "setup", "Résumé modifié.");
		const nextBuild = readPluginItemCards(pluginRoot, SKILL_SOURCE, "fr");

		expect(firstBuild[0].summary).toBe("Premier résumé.");
		expect(nextBuild[0].summary).toBe("Résumé modifié.");
	});
});

describe("loadPluginItemCardViews for skills", () => {
	it("adds the rendered svg of its Lucide icon to each card", async () => {
		const pluginRoot = createPluginRoot();
		writeSkill(pluginRoot, "setup", "Un résumé.");

		const [view] = await loadPluginItemCardViews(
			pluginRoot,
			SKILL_SOURCE,
			"fr",
		);

		expect(view).toMatchObject({ name: "setup", iconName: "rocket" });
		expect(view.iconMarkup).toBe(await renderLucideIconMarkup("rocket"));
		expect(view.iconMarkup).toContain('class="lucide lucide-rocket"');
	});
});

describe("readPluginItemCards for skills in English", () => {
	it("reads the English summary and produces of each displayed skill from its versioned translation", () => {
		const frenchCards = readPluginItemCards(
			findPluginRoot(),
			SKILL_SOURCE,
			"fr",
		);
		const englishCards = readPluginItemCards(
			findPluginRoot(),
			SKILL_SOURCE,
			"en",
		);

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

describe("readPluginItemCards for agents", () => {
	it("The page shows one card per plugin agent, sorted by ascending rank: backend, front-web, front-mobile, reviewer.", () => {
		const cards = readPluginItemCards(findPluginRoot(), AGENT_SOURCE, "fr");

		expect(cards.map((card) => card.name)).toEqual([
			"backend",
			"front-web",
			"front-mobile",
			"reviewer",
		]);
		expect(cards.map((card) => card.badge)).toEqual([
			"lane",
			"lane",
			"lane",
			"review",
		]);
		expect(cards.map((card) => card.iconName)).toEqual([
			"server",
			"panel-top",
			"smartphone",
			"eye",
		]);
	});

	it("reads the summary of an agent from the plugin at each build", () => {
		const pluginRoot = createPluginRoot();
		writeAgent(pluginRoot, "backend", "Premier résumé.");
		const firstBuild = readPluginItemCards(pluginRoot, AGENT_SOURCE, "fr");

		writeAgent(pluginRoot, "backend", "Résumé modifié.");
		const nextBuild = readPluginItemCards(pluginRoot, AGENT_SOURCE, "fr");

		expect(firstBuild[0].summary).toBe("Premier résumé.");
		expect(nextBuild[0].summary).toBe("Résumé modifié.");
	});
});

describe("loadPluginItemCardViews for agents", () => {
	it("adds the rendered svg of its Lucide icon to each card", async () => {
		const pluginRoot = createPluginRoot();
		writeAgent(pluginRoot, "backend", "Un résumé.");

		const [view] = await loadPluginItemCardViews(
			pluginRoot,
			AGENT_SOURCE,
			"fr",
		);

		expect(view).toMatchObject({ name: "backend", iconName: "server" });
		expect(view.iconMarkup).toBe(await renderLucideIconMarkup("server"));
		expect(view.iconMarkup).toContain('class="lucide lucide-server"');
	});
});

describe("readPluginItemCards for agents in English", () => {
	it("reads the English summary and produces of each agent from its versioned translation", () => {
		const frenchCards = readPluginItemCards(
			findPluginRoot(),
			AGENT_SOURCE,
			"fr",
		);
		const englishCards = readPluginItemCards(
			findPluginRoot(),
			AGENT_SOURCE,
			"en",
		);

		expect(englishCards.map((card) => card.name)).toEqual(
			frenchCards.map((card) => card.name),
		);
		expect(englishCards[3]).toMatchObject({
			name: "reviewer",
			badge: "review",
			iconName: "eye",
			summary:
				"Reviews the whole story before the PR, without fixing anything.",
			produces: "Reports findings in three severity levels",
		});
		for (const [index, card] of englishCards.entries()) {
			expect(card.summary, card.name).not.toBe(frenchCards[index].summary);
			expect(card.produces === undefined, card.name).toBe(
				frenchCards[index].produces === undefined,
			);
		}
	});
});
