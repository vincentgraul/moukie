import { describe, expect, it } from "vitest";
import { createSitemap } from "./sitemap";

describe("createSitemap", () => {
	it("renders the URLs as a sitemap document", () => {
		expect(
			createSitemap(["https://example.com/a/", "https://example.com/b/"]),
		).toBe(
			[
				'<?xml version="1.0" encoding="UTF-8"?>',
				'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
				"  <url><loc>https://example.com/a/</loc></url>",
				"  <url><loc>https://example.com/b/</loc></url>",
				"</urlset>",
				"",
			].join("\n"),
		);
	});
});
