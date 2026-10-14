import { describe, expect, it } from "vitest";
import type { PluginFile, PluginMetadata } from "@/shared/api";
import { selectAgentCards, toAgentCard } from "./agent-card";

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

describe("agent cards", () => {
	it("La page affiche une carte par agent du plugin, triées par rang croissant : backend, front-web, front-mobile, reviewer.", () => {
		const files = [
			createDisplayedAgentFile("reviewer", "4", { "moukie-badge": "review" }),
			createDisplayedAgentFile("front-mobile", "3"),
			createDisplayedAgentFile("backend", "1"),
			createDisplayedAgentFile("front-web", "2"),
		];

		expect(selectAgentCards(files).map((card) => card.name)).toEqual([
			"backend",
			"front-web",
			"front-mobile",
			"reviewer",
		]);
	});

	it("sorts by numeric rank, then by name when ranks are equal", () => {
		const files = [
			createDisplayedAgentFile("zeta", "2"),
			createDisplayedAgentFile("beta", "10"),
			createDisplayedAgentFile("alpha", "2"),
		];

		expect(selectAgentCards(files).map((card) => card.name)).toEqual([
			"alpha",
			"zeta",
			"beta",
		]);
	});

	it("Chaque carte affiche l'icône Lucide de l'agent, son nom, le libellé de son badge (Lane ou Review), son résumé et, seulement si `moukie-produces` est renseigné, une ligne précédée d'une flèche avec ce qu'il produit.", () => {
		const withProduces = createDisplayedAgentFile("reviewer", "4", {
			"moukie-badge": "review",
			"moukie-icon": "eye",
			"moukie-produces": "Rend des constats",
		});
		const withEmptyProduces = createDisplayedAgentFile("backend", "1", {
			"moukie-produces": "",
		});
		const withoutProduces = createDisplayedAgentFile("front-web", "2");

		expect(toAgentCard(withProduces)).toEqual({
			name: "reviewer",
			badge: "review",
			iconName: "eye",
			rank: 4,
			summary: "Résumé de reviewer.",
			produces: "Rend des constats",
		});
		expect(toAgentCard(withEmptyProduces)).not.toHaveProperty("produces");
		expect(toAgentCard(withoutProduces)).not.toHaveProperty("produces");
	});

	it("leaves out an agent whose badge is knowledge", () => {
		const files = [
			createDisplayedAgentFile("backend", "1"),
			createAgentFile("helper", { "moukie-badge": "knowledge" }),
		];

		expect(selectAgentCards(files).map((card) => card.name)).toEqual([
			"backend",
		]);
	});

	it("rejects a displayed agent whose metadata is invalid, naming its file", () => {
		const file = createDisplayedAgentFile("broken", "un");

		expect(() => toAgentCard(file)).toThrow(
			"agents/broken.md : moukie-rank « un » n'est pas un entier",
		);
	});
});
