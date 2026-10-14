import {
	dynamicIconImports,
	type IconName,
	iconNames,
} from "lucide-react/dynamic";

export type IconElement = readonly [
	tag: string,
	attributes: Readonly<Record<string, string>>,
];

export type IconShape = readonly IconElement[];

export function isLucideIconName(name: string): name is IconName {
	return (iconNames as readonly string[]).includes(name);
}

export async function loadLucideIconShape(name: IconName): Promise<IconShape> {
	const { __iconData } = await dynamicIconImports[name]();
	return __iconData.node.map(([tag, attributes]) => [
		tag,
		Object.fromEntries(
			Object.entries(attributes)
				.filter(([attribute]) => attribute !== "key")
				.map(([attribute, value]) => [attribute, String(value)]),
		),
	]);
}
