import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { findPluginRoot } from "@/shared/api/index.server";
import { readMarketplace } from "./read-marketplace";

const createdDirectories: string[] = [];

function createRootWithMarketplace(content: string) {
	const root = mkdtempSync(join(tmpdir(), "moukie-marketplace-"));
	createdDirectories.push(root);
	mkdirSync(join(root, ".claude-plugin"));
	writeFileSync(join(root, ".claude-plugin", "marketplace.json"), content);
	return root;
}

afterEach(() => {
	for (const directory of createdDirectories.splice(0)) {
		rmSync(directory, { recursive: true, force: true });
	}
});

describe("readMarketplace", () => {
	it("reads the marketplace name and the name of the plugin published from the root", () => {
		const root = createRootWithMarketplace(
			JSON.stringify({
				name: "market",
				plugins: [
					{ name: "elsewhere", source: "./other" },
					{ name: "tool", source: "./" },
				],
			}),
		);

		expect(readMarketplace(root)).toEqual({
			marketplaceName: "market",
			pluginName: "tool",
		});
	});

	it("reads the marketplace of this repository", () => {
		expect(readMarketplace(findPluginRoot())).toEqual({
			marketplaceName: "vincentgraul",
			pluginName: "moukie",
		});
	});

	it("fails when the marketplace has no name", () => {
		const root = createRootWithMarketplace(
			JSON.stringify({ plugins: [{ name: "tool", source: "./" }] }),
		);

		expect(() => readMarketplace(root)).toThrow(/nom de la marketplace/);
	});

	it("fails when no plugin is published from the root", () => {
		const root = createRootWithMarketplace(
			JSON.stringify({ name: "market", plugins: [] }),
		);

		expect(() => readMarketplace(root)).toThrow(/nom du plugin/);
	});
});
