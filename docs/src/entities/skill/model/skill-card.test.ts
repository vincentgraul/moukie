import { describe, expect, it } from "vitest";
import type { PluginFile, PluginMetadata } from "@/shared/api";
import { selectSkillCards, toSkillCard } from "./skill-card";

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

describe("skill cards", () => {
	it("Les cartes sont triées par rang croissant. À rang égal, elles sont départagées par nom.", () => {
		const files = [
			createDisplayedSkillFile("zeta", "2"),
			createDisplayedSkillFile("beta", "10"),
			createDisplayedSkillFile("alpha", "2"),
			createDisplayedSkillFile("gamma", "1"),
		];

		expect(selectSkillCards(files).map((card) => card.name)).toEqual([
			"gamma",
			"alpha",
			"zeta",
			"beta",
		]);
	});

	it("Les skills `knowledge` n'apparaissent pas.", () => {
		const files = [
			createDisplayedSkillFile("setup", "1"),
			createSkillFile("naming-conventions", { "moukie-badge": "knowledge" }),
		];

		expect(selectSkillCards(files).map((card) => card.name)).toEqual(["setup"]);
		expect(
			toSkillCard(
				createSkillFile("naming-conventions", { "moukie-badge": "knowledge" }),
			),
		).toBeUndefined();
	});

	it("Chaque carte affiche l'icône Lucide du skill, son nom, le libellé de son badge (Projet, Feature ou Story), son résumé et, seulement si `moukie-produces` est renseigné, une ligne précédée d'une flèche avec ce qu'il produit.", () => {
		const withProduces = createDisplayedSkillFile("spec", "6", {
			"moukie-badge": "feature",
			"moukie-icon": "file-text",
			"moukie-produces": "Crée project/specs/",
		});
		const withEmptyProduces = createDisplayedSkillFile("pr", "9", {
			"moukie-produces": "",
		});
		const withoutProduces = createDisplayedSkillFile("contract", "8");

		expect(toSkillCard(withProduces)).toEqual({
			name: "spec",
			badge: "feature",
			iconName: "file-text",
			rank: 6,
			summary: "Résumé de spec.",
			produces: "Crée project/specs/",
		});
		expect(toSkillCard(withEmptyProduces)).not.toHaveProperty("produces");
		expect(toSkillCard(withoutProduces)).not.toHaveProperty("produces");
	});

	it("rejects a displayed skill whose metadata is invalid, naming its file", () => {
		const file = createDisplayedSkillFile("broken", "un");

		expect(() => toSkillCard(file)).toThrow(
			"skills/broken/SKILL.md : moukie-rank « un » n'est pas un entier",
		);
	});
});
