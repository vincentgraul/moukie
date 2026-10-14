import { RocketIcon, TargetIcon } from "lucide-react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { renderLucideIconMarkup } from "./lucide-icon-markup";

describe("renderLucideIconMarkup", () => {
	it("renders the svg of the named Lucide icon, hidden from assistive technologies", async () => {
		const markup = await renderLucideIconMarkup("rocket");

		expect(markup).toBe(
			renderToStaticMarkup(createElement(RocketIcon, { "aria-hidden": true })),
		);
		expect(markup).toMatch(/^<svg [^>]*class="lucide lucide-rocket"/);
		expect(markup).toContain('aria-hidden="true"');
		expect(markup).not.toBe(
			renderToStaticMarkup(createElement(TargetIcon, { "aria-hidden": true })),
		);
	});
});
