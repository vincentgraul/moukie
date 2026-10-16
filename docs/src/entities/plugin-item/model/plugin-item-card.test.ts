import { describe, expect, it } from "vitest";
import type { PluginFile, PluginMetadata } from "@/shared/api";
import { selectPluginItemCards, toPluginItemCard } from "./plugin-item-card";
import { AGENT_LABEL, SKILL_LABEL } from "./plugin-item-label";

function createSkillFile(name: string, metadata: PluginMetadata): PluginFile {
	return {
		path: `skills/${name}/SKILL.md`,
		frontmatter: { name, description: `${name} description`, metadata },
	};
}

function createDisplayedSkillFile(
	name: string,
	rank: string,
	extraMetadata: PluginMetadata = {},
) {
	return createSkillFile(name, {
		"moukie-badge": "story",
		"moukie-icon": "rocket",
		"moukie-rank": rank,
		"moukie-summary": `Résumé de ${name}.`,
		...extraMetadata,
	});
}

function createAgentFile(name: string, metadata: PluginMetadata): PluginFile {
	return {
		path: `agents/${name}.md`,
		frontmatter: { name, description: `${name} description`, metadata },
	};
}

function createDisplayedAgentFile(
	name: string,
	rank: string,
	extraMetadata: PluginMetadata = {},
) {
	return createAgentFile(name, {
		"moukie-badge": "lane",
		"moukie-icon": "server",
		"moukie-rank": rank,
		"moukie-summary": `Résumé de ${name}.`,
		...extraMetadata,
	});
}

describe("skill cards", () => {
	it("The cards are sorted by ascending rank. Ties are broken by name.", () => {
		const files = [
			createDisplayedSkillFile("zeta", "2"),
			createDisplayedSkillFile("beta", "10"),
			createDisplayedSkillFile("alpha", "2"),
			createDisplayedSkillFile("gamma", "1"),
		];

		expect(
			selectPluginItemCards(files, SKILL_LABEL).map((card) => card.name),
		).toEqual(["gamma", "alpha", "zeta", "beta"]);
	});

	it("`knowledge` skills do not appear.", () => {
		const files = [
			createDisplayedSkillFile("setup", "1"),
			createSkillFile("naming-conventions", { "moukie-badge": "knowledge" }),
		];

		expect(
			selectPluginItemCards(files, SKILL_LABEL).map((card) => card.name),
		).toEqual(["setup"]);
		expect(
			toPluginItemCard(
				createSkillFile("naming-conventions", { "moukie-badge": "knowledge" }),
				SKILL_LABEL,
			),
		).toBeUndefined();
	});

	it("Each card shows the skill's Lucide icon, its name, its badge label (Projet, Feature or Story), its summary and, only when `moukie-produces` is set, a line preceded by an arrow with what it produces.", () => {
		const withProduces = createDisplayedSkillFile("spec", "6", {
			"moukie-badge": "feature",
			"moukie-icon": "file-text",
			"moukie-produces": "Crée project/specs/",
		});
		const withEmptyProduces = createDisplayedSkillFile("pr", "9", {
			"moukie-produces": "",
		});
		const withoutProduces = createDisplayedSkillFile("contract", "8");

		expect(toPluginItemCard(withProduces, SKILL_LABEL)).toEqual({
			name: "spec",
			badge: "feature",
			iconName: "file-text",
			rank: 6,
			summary: "Résumé de spec.",
			produces: "Crée project/specs/",
		});
		expect(toPluginItemCard(withEmptyProduces, SKILL_LABEL)).not.toHaveProperty(
			"produces",
		);
		expect(toPluginItemCard(withoutProduces, SKILL_LABEL)).not.toHaveProperty(
			"produces",
		);
	});

	it("rejects a displayed skill whose metadata is invalid, naming its file", () => {
		const file = createDisplayedSkillFile("broken", "un");

		expect(() => toPluginItemCard(file, SKILL_LABEL)).toThrow(
			"skills/broken/SKILL.md : moukie-rank « un » n'est pas un entier",
		);
	});
});

describe("agent cards", () => {
	it("The page shows one card per plugin agent, sorted by ascending rank: backend, front-web, front-mobile, reviewer.", () => {
		const files = [
			createDisplayedAgentFile("reviewer", "4", { "moukie-badge": "review" }),
			createDisplayedAgentFile("front-mobile", "3"),
			createDisplayedAgentFile("backend", "1"),
			createDisplayedAgentFile("front-web", "2"),
		];

		expect(
			selectPluginItemCards(files, AGENT_LABEL).map((card) => card.name),
		).toEqual(["backend", "front-web", "front-mobile", "reviewer"]);
	});

	it("sorts by numeric rank, then by name when ranks are equal", () => {
		const files = [
			createDisplayedAgentFile("zeta", "2"),
			createDisplayedAgentFile("beta", "10"),
			createDisplayedAgentFile("alpha", "2"),
		];

		expect(
			selectPluginItemCards(files, AGENT_LABEL).map((card) => card.name),
		).toEqual(["alpha", "zeta", "beta"]);
	});

	it("Each card shows the agent's Lucide icon, its name, its badge label (Lane or Review), its summary and, only when `moukie-produces` is set, a line preceded by an arrow with what it produces.", () => {
		const withProduces = createDisplayedAgentFile("reviewer", "4", {
			"moukie-badge": "review",
			"moukie-icon": "eye",
			"moukie-produces": "Rend des constats",
		});
		const withEmptyProduces = createDisplayedAgentFile("backend", "1", {
			"moukie-produces": "",
		});
		const withoutProduces = createDisplayedAgentFile("front-web", "2");

		expect(toPluginItemCard(withProduces, AGENT_LABEL)).toEqual({
			name: "reviewer",
			badge: "review",
			iconName: "eye",
			rank: 4,
			summary: "Résumé de reviewer.",
			produces: "Rend des constats",
		});
		expect(toPluginItemCard(withEmptyProduces, AGENT_LABEL)).not.toHaveProperty(
			"produces",
		);
		expect(toPluginItemCard(withoutProduces, AGENT_LABEL)).not.toHaveProperty(
			"produces",
		);
	});

	it("leaves out an agent whose badge is knowledge", () => {
		const files = [
			createDisplayedAgentFile("backend", "1"),
			createAgentFile("helper", { "moukie-badge": "knowledge" }),
		];

		expect(
			selectPluginItemCards(files, AGENT_LABEL).map((card) => card.name),
		).toEqual(["backend"]);
	});

	it("rejects a displayed agent whose metadata is invalid, naming its file", () => {
		const file = createDisplayedAgentFile("broken", "un");

		expect(() => toPluginItemCard(file, AGENT_LABEL)).toThrow(
			"agents/broken.md : moukie-rank « un » n'est pas un entier",
		);
	});
});

describe("toPluginItemCard", () => {
	it("rejects an item without a name, naming its file", () => {
		const file = createDisplayedSkillFile("", "1");

		expect(() => toPluginItemCard(file, SKILL_LABEL)).toThrow(
			"skills//SKILL.md : name manquant",
		);
	});
});
