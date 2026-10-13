import type { Frontmatter } from "@/shared/lib";

export type PluginMetadata = Readonly<Record<string, string>>;

export type PluginFile = {
	readonly path: string;
	readonly frontmatter: Frontmatter;
};

export function getPluginMetadata(
	file: PluginFile,
): PluginMetadata | undefined {
	const metadata = file.frontmatter.metadata;
	if (
		metadata === undefined ||
		typeof metadata === "string" ||
		Array.isArray(metadata)
	) {
		return undefined;
	}
	return metadata as PluginMetadata;
}
