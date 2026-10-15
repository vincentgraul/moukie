import { createServerFn } from "@tanstack/react-start";
import { findPluginRoot } from "@/shared/api/index.server";
import { REPOSITORY_URL } from "@/shared/config";
import { buildInstallCommands } from "../model/install-commands";
import { readMarketplace } from "./read-marketplace";

export const getInstallCommands = createServerFn({ method: "GET" }).handler(
	() =>
		buildInstallCommands({
			repositoryUrl: REPOSITORY_URL,
			...readMarketplace(findPluginRoot()),
		}),
);
