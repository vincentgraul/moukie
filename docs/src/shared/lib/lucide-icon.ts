import { type IconName, iconNames } from "lucide-react/dynamic";

export type IconElement = readonly [
	tag: string,
	attributes: Readonly<Record<string, string>>,
];

export type IconShape = readonly IconElement[];

export function isLucideIconName(name: string): name is IconName {
	return (iconNames as readonly string[]).includes(name);
}
