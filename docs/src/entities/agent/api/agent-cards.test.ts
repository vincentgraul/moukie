import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { findPluginRoot } from "@/shared/api/index.server";
import { renderLucideIconMarkup } from "@/shared/lib/index.server";
import { loadAgentCardViews, readAgentCards } from "./agent-cards";

const createdDirectories: string[] = [];

function createPluginRoot() {
	const pluginRoot = mkdtempSync(join(tmpdir(), "moukie-agent-cards-"));
	createdDirectories.push(pluginRoot);
	mkdirSync(join(pluginRoot, ".claude-plugin"));
	writeFileSync(join(pluginRoot, ".claude-plugin", "plugin.json"), "{}");
	mkdirSync(join(pluginRoot, "agents"));
	return pluginRoot;
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

describe("readAgentCards", () => {
	it("La page affiche une carte par agent du plugin, triées par rang croissant : backend, front-web, front-mobile, reviewer.", () => {
		const cards = readAgentCards(findPluginRoot(), "fr");

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
		const firstBuild = readAgentCards(pluginRoot, "fr");

		writeAgent(pluginRoot, "backend", "Résumé modifié.");
		const nextBuild = readAgentCards(pluginRoot, "fr");

		expect(firstBuild[0].summary).toBe("Premier résumé.");
		expect(nextBuild[0].summary).toBe("Résumé modifié.");
	});
});

describe("loadAgentCardViews", () => {
	it("adds the rendered svg of its Lucide icon to each card", async () => {
		const pluginRoot = createPluginRoot();
		writeAgent(pluginRoot, "backend", "Un résumé.");

		const [view] = await loadAgentCardViews(pluginRoot, "fr");

		expect(view).toMatchObject({ name: "backend", iconName: "server" });
		expect(view.iconMarkup).toBe(await renderLucideIconMarkup("server"));
		expect(view.iconMarkup).toContain('class="lucide lucide-server"');
	});
});

describe("readAgentCards in English", () => {
	it("reads the English summary and produces of each agent from its versioned translation", () => {
		const frenchCards = readAgentCards(findPluginRoot(), "fr");
		const englishCards = readAgentCards(findPluginRoot(), "en");

		expect(englishCards.map((card) => card.name)).toEqual(
			frenchCards.map((card) => card.name),
		);
		expect(englishCards[3]).toMatchObject({
			name: "reviewer",
			badge: "review",
			iconName: "eye",
			summary:
				"Reviews the whole story before the PR, without fixing anything.",
			produces: "Reports findings ranked in three levels",
		});
		for (const [index, card] of englishCards.entries()) {
			expect(card.summary, card.name).not.toBe(frenchCards[index].summary);
			expect(card.produces === undefined, card.name).toBe(
				frenchCards[index].produces === undefined,
			);
		}
	});
});
