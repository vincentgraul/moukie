import { createServerFn } from "@tanstack/react-start";
import { findPluginRoot } from "@/shared/api/index.server";
import { loadSkillCardViews } from "./skill-cards";

export const getSkillCards = createServerFn({ method: "GET" }).handler(() =>
	loadSkillCardViews(findPluginRoot()),
);
