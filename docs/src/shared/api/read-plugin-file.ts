import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseFrontmatter } from "@/shared/lib";
import type { PluginFile } from "./plugin-file";

export function readPluginFile(pluginRoot: string, path: string): PluginFile {
	const source = readFileSync(join(pluginRoot, path), "utf8");
	return { path, frontmatter: parseFrontmatter(source) };
}
