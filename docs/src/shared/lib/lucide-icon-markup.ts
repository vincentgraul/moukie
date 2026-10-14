import { dynamicIconImports, type IconName } from "lucide-react/dynamic";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

export async function renderLucideIconMarkup(name: IconName): Promise<string> {
	const { default: LucideIcon } = await dynamicIconImports[name]();
	return renderToStaticMarkup(
		createElement(LucideIcon, { "aria-hidden": true }),
	);
}
