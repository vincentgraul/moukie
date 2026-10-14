import {
	BookAlertIcon,
	BotIcon,
	type LucideIcon,
	MapIcon,
	SettingsIcon,
} from "lucide-react";
import { type Locale, m } from "@/shared/i18n";

export type NavigationEntry = {
	readonly page: string;
	readonly icon: LucideIcon;
	readonly label: (locale: Locale) => string;
};

export const NAVIGATION_ENTRIES: readonly NavigationEntry[] = [
	{
		page: "getting-started",
		icon: BookAlertIcon,
		label: (locale) => m.navigation_getting_started({}, { locale }),
	},
	{
		page: "skills",
		icon: SettingsIcon,
		label: (locale) => m.navigation_skills({}, { locale }),
	},
	{
		page: "agents",
		icon: BotIcon,
		label: (locale) => m.navigation_agents({}, { locale }),
	},
	{
		page: "workflow-map",
		icon: MapIcon,
		label: (locale) => m.navigation_workflow_map({}, { locale }),
	},
];
