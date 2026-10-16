import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, type Page, test } from "@playwright/test";

const SITE_URL = "https://vincentgraul.github.io/moukie/";

type Messages = Record<string, string>;

function readMessages(locale: string): Messages {
	return JSON.parse(
		readFileSync(
			resolve(import.meta.dirname, `../messages/${locale}.json`),
			"utf8",
		),
	);
}

const MESSAGES: Record<string, Messages> = {
	fr: readMessages("fr"),
	en: readMessages("en"),
};

const OPEN_GRAPH_LOCALES: Record<string, string> = {
	fr: "fr_FR",
	en: "en_US",
};

function expectedPages(locale: string) {
	const messages = MESSAGES[locale];
	return [
		{
			locale,
			path: `${locale}/`,
			title: "Moukie",
			description: messages.home_subtitle,
		},
		{
			locale,
			path: `${locale}/getting-started/`,
			title: `${messages.getting_started_title} · Moukie`,
			description: `${messages.getting_started_intro_context} ${messages.getting_started_intro_flow}`,
		},
		{
			locale,
			path: `${locale}/skills/`,
			title: `${messages.skills_title} · Moukie`,
			description: messages.skills_intro,
		},
		{
			locale,
			path: `${locale}/agents/`,
			title: `${messages.agents_title} · Moukie`,
			description: messages.agents_intro,
		},
	];
}

const PAGES = [...expectedPages("fr"), ...expectedPages("en")];

async function metaContent(page: Page, selector: string) {
	return page.locator(selector).evaluateAll((elements) =>
		elements.map((element) => ({
			content: element.getAttribute("content"),
			href: element.getAttribute("href"),
			hreflang: element.getAttribute("hreflang"),
		})),
	);
}

test("Chaque page, dans chaque langue, déclare une meta description : le message du produit pour l'accueil, l'introduction de la page pour Getting started, Skills et Agents.", async ({
	browser,
}) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();

	for (const { path, description } of PAGES) {
		await page.goto(path);
		const descriptions = await metaContent(page, 'meta[name="description"]');
		expect(descriptions, path).toEqual([
			{ content: description, href: null, hreflang: null },
		]);
	}
	await context.close();
});

test("Chaque page déclare `og:title`, `og:description`, `og:url`, `og:type` et `og:locale` (`fr_FR` ou `en_US`). Le titre et la description reprennent ceux de la page.", async ({
	browser,
}) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();

	for (const { locale, path, title, description } of PAGES) {
		await page.goto(path);
		await expect(page, path).toHaveTitle(title);
		const expected = {
			"og:title": title,
			"og:description": description,
			"og:url": `${SITE_URL}${path}`,
			"og:type": "website",
			"og:locale": OPEN_GRAPH_LOCALES[locale],
		};
		for (const [property, content] of Object.entries(expected)) {
			expect(
				await metaContent(page, `meta[property="${property}"]`),
				`${path} ${property}`,
			).toEqual([{ content, href: null, hreflang: null }]);
		}
	}
	await context.close();
});

test("Chaque page déclare son URL canonique absolue, sous `https://vincentgraul.github.io/moukie/`, avec la barre oblique finale.", async ({
	browser,
}) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();

	for (const { path } of PAGES) {
		await page.goto(path);
		const canonicals = await metaContent(page, 'link[rel="canonical"]');
		expect(canonicals, path).toEqual([
			{ content: null, href: `${SITE_URL}${path}`, hreflang: null },
		]);
		expect(canonicals[0].href).toMatch(/\/$/);
	}
	await context.close();
});

test("Chaque page déclare en `hreflang` ses versions `fr` et `en`, et `x-default` vers la version française.", async ({
	browser,
}) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();

	for (const { path } of PAGES) {
		const suffix = path.slice(3);
		await page.goto(path);
		const alternates = await metaContent(page, 'link[rel="alternate"]');
		expect(alternates, path).toEqual([
			{ content: null, href: `${SITE_URL}fr/${suffix}`, hreflang: "fr" },
			{ content: null, href: `${SITE_URL}en/${suffix}`, hreflang: "en" },
			{
				content: null,
				href: `${SITE_URL}fr/${suffix}`,
				hreflang: "x-default",
			},
		]);
	}
	await context.close();
});

test("Le build produit `/moukie/sitemap.xml`, qui liste toutes les pages des deux langues par leur URL canonique, et seulement elles : ni les redirections, ni les 404.", async ({
	page,
}) => {
	const response = await page.request.get("/moukie/sitemap.xml");
	expect(response.status()).toBe(200);
	const sitemap = await response.text();

	const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
		(match) => match[1],
	);
	expect(locations.sort()).toEqual(
		PAGES.map(({ path }) => `${SITE_URL}${path}`).sort(),
	);
	for (const location of locations) {
		expect(location).not.toMatch(/404/);
		expect(location).not.toBe(SITE_URL);
	}

	for (const location of locations) {
		const pageResponse = await page.request.get(
			location.replace(SITE_URL, "/moukie/"),
			{ maxRedirects: 0 },
		);
		expect(pageResponse.status(), location).toBe(200);
	}
});

test("Les pages de redirection déclarent `noindex`, et pour URL canonique celle de la page vers laquelle elles redirigent.", async ({
	page,
}) => {
	const response = await page.request.get("/moukie/");
	const html = await response.text();

	expect(html).toMatch(/<meta name="robots" content="noindex"\/?>/);
	expect(html).toMatch(
		/<meta http-equiv="refresh" content="0; url=\/moukie\/fr\/"\/?>/,
	);
	expect(html.match(/<link rel="canonical"[^>]*>/g)).toEqual([
		expect.stringContaining(`href="${SITE_URL}fr/"`),
	]);
});

test("Toutes ces métadonnées sont dans le HTML pré-rendu, sans JavaScript.", async ({
	page,
}) => {
	for (const { path, title } of PAGES) {
		const html = readFileSync(
			resolve(import.meta.dirname, "../dist/client", path, "index.html"),
			"utf8",
		);
		expect(html, path).toContain(`<title>${title}</title>`);
		expect(html, path).toContain('name="description"');
		for (const property of [
			"og:title",
			"og:description",
			"og:url",
			"og:type",
			"og:locale",
		]) {
			expect(html, `${path} ${property}`).toContain(`property="${property}"`);
		}
		expect(html, path).toContain('rel="canonical"');
		expect(html.match(/hreflang="/g), path).toHaveLength(3);
	}

	const redirect = readFileSync(
		resolve(import.meta.dirname, "../dist/client/index.html"),
		"utf8",
	);
	expect(redirect).toContain('rel="canonical"');
	expect(redirect).toContain('content="noindex"');

	for (const { path } of PAGES) {
		await page.goto(path);
		await page.waitForLoadState("networkidle");
		for (const selector of [
			"title",
			'meta[name="description"]',
			'meta[property="og:title"]',
			'meta[property="og:description"]',
			'meta[property="og:url"]',
			'meta[property="og:type"]',
			'meta[property="og:locale"]',
			'link[rel="canonical"]',
		]) {
			await expect(page.locator(selector), `${path} ${selector}`).toHaveCount(
				1,
			);
		}
		await expect(page.locator('link[rel="alternate"]'), path).toHaveCount(3);
	}
});
