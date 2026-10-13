import { checkPluginFile } from "@/shared/api";
import { listAgentFilePaths } from "../api/agent-files";

export function checkAgentsMetadata(pluginRoot: string): string[] {
	return listAgentFilePaths(pluginRoot).flatMap((path) =>
		checkPluginFile(pluginRoot, path),
	);
}
