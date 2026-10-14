import type { LinkProps } from "@tanstack/react-router";
import {
	BookAlert,
	Bot,
	type LucideIcon,
	MapIcon,
	Settings,
} from "lucide-react";
import { type Locale, m } from "@/shared/i18n";

export type NavigationEntry = {
	readonly id: string;
	readonly icon: LucideIcon;
	readonly label: (locale: Locale) => string;
	readonly to?: LinkProps["to"];
};

export const NAVIGATION_ENTRIES: readonly NavigationEntry[] = [
	{
		id: "getting-started",
		icon: BookAlert,
		label: (locale) => m.navigation_getting_started({}, { locale }),
	},
	{
		id: "skills",
		icon: Settings,
		label: (locale) => m.navigation_skills({}, { locale }),
		to: "/$locale/skills",
	},
	{
		id: "agents",
		icon: Bot,
		label: (locale) => m.navigation_agents({}, { locale }),
	},
	{
		id: "workflow-map",
		icon: MapIcon,
		label: (locale) => m.navigation_workflow_map({}, { locale }),
	},
];
