import { describe, expect, it } from "vitest";
import { createCanonicalLink, createPageHead } from "./page-head";

describe("createPageHead", () => {
	it("describes a French page for search engines and link previews", () => {
		expect(
			createPageHead({
				locale: "fr",
				page: "skills",
				title: "Skills · Moukie",
				description: "Un skill est une compétence de Moukie.",
			}),
		).toEqual({
			meta: [
				{ title: "Skills · Moukie" },
				{
					name: "description",
					content: "Un skill est une compétence de Moukie.",
				},
				{ property: "og:title", content: "Skills · Moukie" },
				{
					property: "og:description",
					content: "Un skill est une compétence de Moukie.",
				},
				{
					property: "og:url",
					content: "https://moukie.dev/fr/skills/",
				},
				{ property: "og:type", content: "website" },
				{ property: "og:locale", content: "fr_FR" },
			],
			links: [
				{
					rel: "canonical",
					href: "https://moukie.dev/fr/skills/",
				},
				{
					rel: "alternate",
					hreflang: "fr",
					href: "https://moukie.dev/fr/skills/",
				},
				{
					rel: "alternate",
					hreflang: "en",
					href: "https://moukie.dev/en/skills/",
				},
				{
					rel: "alternate",
					hreflang: "x-default",
					href: "https://moukie.dev/fr/skills/",
				},
			],
		});
	});

	it("declares the English locale and the home page of its language", () => {
		const { meta, links } = createPageHead({
			locale: "en",
			title: "Moukie",
			description: "Solo, from Figma mockup to PR.",
		});

		expect(meta).toContainEqual({ property: "og:locale", content: "en_US" });
		expect(meta).toContainEqual({
			property: "og:url",
			content: "https://moukie.dev/en/",
		});
		expect(links).toContainEqual({
			rel: "canonical",
			href: "https://moukie.dev/en/",
		});
		expect(links).toContainEqual({
			rel: "alternate",
			hreflang: "x-default",
			href: "https://moukie.dev/fr/",
		});
	});
});

describe("createCanonicalLink", () => {
	it("points to the absolute URL of a page, with its trailing slash", () => {
		expect(createCanonicalLink("fr")).toEqual({
			rel: "canonical",
			href: "https://moukie.dev/fr/",
		});
		expect(createCanonicalLink("en", "getting-started")).toEqual({
			rel: "canonical",
			href: "https://moukie.dev/en/getting-started/",
		});
	});
});
