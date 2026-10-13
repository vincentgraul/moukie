import { type IconName, iconNames } from "lucide-react/dynamic";

const LUCIDE_ICON_NAMES: ReadonlySet<string> = new Set(iconNames);

export function isLucideIconName(name: string): name is IconName {
	return LUCIDE_ICON_NAMES.has(name);
}
