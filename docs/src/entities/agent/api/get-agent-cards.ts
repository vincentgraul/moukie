import { createServerFn } from "@tanstack/react-start";
import { findPluginRoot } from "@/shared/api/index.server";
import { loadAgentCardViews } from "./agent-cards";

export const getAgentCards = createServerFn({ method: "GET" }).handler(() =>
	loadAgentCardViews(findPluginRoot()),
);
