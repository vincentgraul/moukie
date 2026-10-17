import { describe, expect, it } from "vitest";
import { createRobots } from "./robots";

describe("createRobots", () => {
	it("allows every robot on the whole site and gives the sitemap URL", () => {
		expect(createRobots("https://example.com/sitemap.xml")).toBe(
			[
				"User-agent: *",
				"Allow: /",
				"Sitemap: https://example.com/sitemap.xml",
				"",
			].join("\n"),
		);
	});
});
