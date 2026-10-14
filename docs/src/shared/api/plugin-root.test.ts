import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { findPluginRoot } from "./plugin-root";

const createdDirectories: string[] = [];

function createDirectory() {
	const directory = mkdtempSync(join(tmpdir(), "moukie-root-"));
	createdDirectories.push(directory);
	return directory;
}

function createPluginRoot() {
	const pluginRoot = createDirectory();
	mkdirSync(join(pluginRoot, ".claude-plugin"));
	writeFileSync(join(pluginRoot, ".claude-plugin", "plugin.json"), "{}");
	mkdirSync(join(pluginRoot, "docs", "src"), { recursive: true });
	return pluginRoot;
}

afterEach(() => {
	for (const directory of createdDirectories.splice(0)) {
		rmSync(directory, { recursive: true, force: true });
	}
});

describe("findPluginRoot", () => {
	it("returns the start directory when it holds .claude-plugin/plugin.json", () => {
		const pluginRoot = createPluginRoot();

		expect(findPluginRoot(pluginRoot)).toBe(pluginRoot);
	});

	it("walks up from a nested directory such as docs/", () => {
		const pluginRoot = createPluginRoot();

		expect(findPluginRoot(join(pluginRoot, "docs"))).toBe(pluginRoot);
		expect(findPluginRoot(join(pluginRoot, "docs", "src"))).toBe(pluginRoot);
	});

	it("finds the repository root from the current directory under Vitest", () => {
		expect(
			existsSync(join(findPluginRoot(), ".claude-plugin", "plugin.json")),
		).toBe(true);
	});

	it("throws an explicit error when no plugin manifest is found", () => {
		const directory = createDirectory();

		expect(() => findPluginRoot(directory)).toThrow(
			/\.claude-plugin\/plugin\.json/,
		);
	});
});
