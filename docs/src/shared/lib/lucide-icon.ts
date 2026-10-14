import { type IconName, iconNames } from "lucide-react/dynamic";

export function isLucideIconName(name: string): name is IconName {
	return (iconNames as readonly string[]).includes(name);
}
