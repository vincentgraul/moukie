import { describe, expect, it } from "vitest";
import { getPluginMetadata, type PluginMetadata } from "@/shared/api";
import { PLUGIN_ROOT } from "@/shared/config";
import { readAgentFiles } from "../api/agent-files";

const AGENT_CARDS = {
	backend: {
		"moukie-badge": "lane",
		"moukie-icon": "server",
		"moukie-rank": "1",
	},
	"front-web": {
		"moukie-badge": "lane",
		"moukie-icon": "panel-top",
		"moukie-rank": "2",
	},
	"front-mobile": {
		"moukie-badge": "lane",
		"moukie-icon": "smartphone",
		"moukie-rank": "3",
	},
	reviewer: {
		"moukie-badge": "review",
		"moukie-icon": "eye",
		"moukie-rank": "4",
	},
};

const CARD_TEXT_MAX_LENGTH = 70;

function readMetadataByName(): Map<string, PluginMetadata> {
	return new Map(
		readAgentFiles(PLUGIN_ROOT).map((file) => [
			String(file.frontmatter.name),
			getPluginMetadata(file) ?? {},
		]),
	);
}

function isSingleSentence(text: string) {
	return !/[.!?]\s+\S/.test(text);
}

describe("agent metadata", () => {
	it("Les 4 agents portent `moukie-badge`, `moukie-icon`, `moukie-rank` et `moukie-summary`, plus `moukie-produces` quand l'agent produit quelque chose. Les valeurs fixées par la maquette : `backend` · `lane` · `server` · `1` ; `front-web` · `lane` · `panel-top` · `2` ; `front-mobile` · `lane` · `smartphone` · `3` ; `reviewer` · `review` · `eye` · `4`.", () => {
		const metadataByName = readMetadataByName();

		expect([...metadataByName.keys()].sort()).toEqual(
			Object.keys(AGENT_CARDS).sort(),
		);
		for (const [name, expectedCard] of Object.entries(AGENT_CARDS)) {
			const metadata = metadataByName.get(name);
			expect(metadata, name).toMatchObject(expectedCard);
			expect(metadata?.["moukie-summary"], name).toBeTruthy();
			const moukieKeys = Object.keys(metadata ?? {}).filter((key) =>
				key.startsWith("moukie-"),
			);
			expect(
				moukieKeys.every((key) =>
					[
						"moukie-badge",
						"moukie-icon",
						"moukie-rank",
						"moukie-summary",
						"moukie-produces",
					].includes(key),
				),
				name,
			).toBe(true);
		}
	});

	it("Les résumés et « produits » des agents sont rédigés à partir de leur fichier, dans le ton et la longueur des cartes Skills (une phrase de moins de 70 caractères), et relus dans la PR.", () => {
		for (const [name, metadata] of readMetadataByName()) {
			const texts = [
				metadata["moukie-summary"],
				metadata["moukie-produces"],
			].filter((text): text is string => text !== undefined);
			for (const text of texts) {
				expect(text.length, `${name} : ${text}`).toBeLessThan(
					CARD_TEXT_MAX_LENGTH,
				);
				expect(isSingleSentence(text), `${name} : ${text}`).toBe(true);
			}
			expect(metadata["moukie-summary"], name).toMatch(/\.$/);
		}
	});
});
