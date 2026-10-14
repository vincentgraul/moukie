import { dynamicIconImports, type IconName } from "lucide-react/dynamic";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { IconShape } from "./lucide-icon";

const SHAPE_ELEMENT_PATTERN = /<(\w+)((?:\s+[\w-]+="[^"]*")*)\s*><\/\1>/g;
const ATTRIBUTE_PATTERN = /([\w-]+)="([^"]*)"/g;
const HTML_ENTITIES: Readonly<Record<string, string>> = {
	"&amp;": "&",
	"&quot;": '"',
	"&#x27;": "'",
	"&lt;": "<",
	"&gt;": ">",
};

export async function loadLucideIconShape(name: IconName): Promise<IconShape> {
	const { default: LucideIcon } = await dynamicIconImports[name]();
	const shape = parseIconShape(renderToStaticMarkup(createElement(LucideIcon)));
	if (shape.length === 0) {
		throw new Error(`icône Lucide « ${name} » illisible`);
	}
	return shape;
}

export function parseIconShape(svgMarkup: string): IconShape {
	return [...svgMarkup.matchAll(SHAPE_ELEMENT_PATTERN)].map(
		([, tag, attributes]) => [
			tag,
			Object.fromEntries(
				[...attributes.matchAll(ATTRIBUTE_PATTERN)].map(
					([, attribute, value]) => [
						toCamelCase(attribute),
						decodeHtmlEntities(value),
					],
				),
			),
		],
	);
}

function toCamelCase(attribute: string) {
	return attribute.replace(/-(\w)/g, (_, letter: string) =>
		letter.toUpperCase(),
	);
}

function decodeHtmlEntities(value: string) {
	return value.replace(
		/&(?:amp|quot|#x27|lt|gt);/g,
		(entity) => HTML_ENTITIES[entity] ?? entity,
	);
}
