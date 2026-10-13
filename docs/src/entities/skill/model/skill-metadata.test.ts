import { describe, expect, it } from "vitest";
import { getPluginMetadata } from "@/shared/api";
import { PLUGIN_ROOT } from "@/shared/config";
import { readSkillFiles } from "../api/skill-files";

const DISPLAYED_SKILLS = {
	setup: {
		"moukie-badge": "project",
		"moukie-icon": "rocket",
		"moukie-rank": "1",
		"moukie-summary":
			"Mène l'entretien de départ et configure tout le workflow.",
		"moukie-produces": "Crée project/ et CLAUDE.md",
	},
	product: {
		"moukie-badge": "project",
		"moukie-icon": "target",
		"moukie-rank": "2",
		"moukie-summary": "Challenge ton produit, avec une veille sur l'existant.",
		"moukie-produces": "Crée product.md et market.md",
	},
	stack: {
		"moukie-badge": "project",
		"moukie-icon": "layers",
		"moukie-rank": "3",
		"moukie-summary":
			"Confronte la stack au produit, versions et licences vérifiées.",
		"moukie-produces": "Crée stack.md",
	},
	architecture: {
		"moukie-badge": "project",
		"moukie-icon": "building",
		"moukie-rank": "4",
		"moukie-summary":
			"Apps, dépôt, découpage du front et du back, modules, contrat.",
		"moukie-produces": "Crée architecture.md",
	},
	scaffold: {
		"moukie-badge": "project",
		"moukie-icon": "hammer",
		"moukie-rank": "5",
		"moukie-summary":
			"Génère les apps qui manquent, sans toucher au code existant.",
	},
	spec: {
		"moukie-badge": "feature",
		"moukie-icon": "file-text",
		"moukie-rank": "6",
		"moukie-summary": "Cadre une feature et la découpe en stories.",
		"moukie-produces": "Crée project/specs/",
	},
	orchestrator: {
		"moukie-badge": "story",
		"moukie-icon": "clef-treble",
		"moukie-rank": "7",
		"moukie-summary": "Une lane par app, en parallèle, jusqu'à la PR.",
		"moukie-produces": "Appelle contract et pr",
	},
	contract: {
		"moukie-badge": "story",
		"moukie-icon": "key-round",
		"moukie-rank": "8",
		"moukie-summary":
			"Gèle l'interface entre les apps avant le travail parallèle.",
	},
	pr: {
		"moukie-badge": "story",
		"moukie-icon": "git-branch",
		"moukie-rank": "9",
		"moukie-summary": "Commite, pousse et ouvre la PR. Ne merge jamais.",
	},
};

const KNOWLEDGE_SKILLS = [
	"naming-conventions",
	"feature-sliced-design",
	"figma-annotations",
];

function readMoukieMetadataByName() {
	return new Map(
		readSkillFiles(PLUGIN_ROOT).map((file) => {
			const metadata = getPluginMetadata(file) ?? {};
			const moukieEntries = Object.entries(metadata).filter(([key]) =>
				key.startsWith("moukie-"),
			);
			return [String(file.frontmatter.name), Object.fromEntries(moukieEntries)];
		}),
	);
}

describe("skill metadata", () => {
	it("Les 9 skills affichables portent, dans le `metadata` de leur frontmatter, ces valeurs :", () => {
		const metadataByName = readMoukieMetadataByName();

		for (const [name, expectedMetadata] of Object.entries(DISPLAYED_SKILLS)) {
			expect(metadataByName.get(name), name).toEqual(expectedMetadata);
		}
	});

	it("Les skills `naming-conventions`, `feature-sliced-design` et `figma-annotations` portent `moukie-badge: knowledge`, et aucune autre clé `moukie-*`.", () => {
		const metadataByName = readMoukieMetadataByName();

		for (const name of KNOWLEDGE_SKILLS) {
			expect(metadataByName.get(name), name).toEqual({
				"moukie-badge": "knowledge",
			});
		}
	});
});
