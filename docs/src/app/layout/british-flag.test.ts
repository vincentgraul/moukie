import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { FlagGb } from "@empreint/ui";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

describe("british flag", () => {
	it("is the gb flag provided by Empreint", () => {
		const asset = readFileSync(
			resolve(import.meta.dirname, "british-flag.svg"),
			"utf8",
		);

		expect(asset.trim()).toBe(renderToStaticMarkup(createElement(FlagGb)));
	});
});
