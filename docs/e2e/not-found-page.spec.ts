import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, type Page, test } from "@playwright/test";

const REPOSITORY_URL = "https://github.com/vincentgraul/moukie";
const FRENCH = {
	locale: "fr",
	githubLabel: "Moukie sur GitHub",
	title: "Page introuvable",
	button: "Retour à l'accueil",
	homeUrl: "/fr/",
	documentTitle: "Page introuvable · Moukie",
	file: "404.html",
	url: "404.html",
} as const;
const ENGLISH = {
	locale: "en",
	githubLabel: "Moukie on GitHub",
	title: "Page not found",
	button: "Go home",
	homeUrl: "/en/",
	documentTitle: "Page not found · Moukie",
	file: "en/404/index.html",
	url: "en/404/",
} as const;
const NOT_FOUND_PAGES = [FRENCH, ENGLISH] as const;

function readBuiltPage(path: string) {
	return readFileSync(
		resolve(import.meta.dirname, "../dist/client", path),
		"utf8",
	);
}

function pageHeader(page: Page, githubLabel: string) {
	return page.locator("header").filter({
		has: page.getByRole("link", { name: githubLabel }),
	});
}

async function openLanguageOption(page: Page, locale: string) {
	await page.locator("header button[aria-labelledby]").click();
	await page
		.locator("header li button")
		.filter({ has: page.getByRole("img", { name: locale, exact: true }) })
		.click();
}

test("The build produces, prerendered, the French 404 at `/404.html` and the English one at `/en/404/`. The end-to-end static server serves the French one, with status 404, for any unknown URL, like GitHub Pages.", async ({
	page,
}) => {
	expect(
		existsSync(resolve(import.meta.dirname, "../dist/client/404.html")),
	).toBe(true);
	expect(readBuiltPage(FRENCH.file)).toContain(FRENCH.title);
	expect(readBuiltPage(ENGLISH.file)).toContain(ENGLISH.title);

	for (const path of [
		"unknown/",
		"unknown",
		"fr/unknown/",
		"fr/skills/unknown/",
		"en/unknown.html",
		"assets/unknown.js",
	]) {
		const response = await page.request.get(`/${path}`, {
			maxRedirects: 0,
		});
		expect(response.status(), path).toBe(404);
		expect(await response.text(), path).toContain(FRENCH.title);
	}
});

test("The French 404 shows the shared header (GitHub icon, separator, language selector), without a sidebar, then “404”, “Page introuvable” and the “Retour à l'accueil” button, which leads to `/fr/`.", async ({
	page,
}) => {
	for (const url of ["404.html", "unknown/"]) {
		await page.goto(url);

		await expect(
			page.getByRole("navigation", { name: "Navigation principale" }),
		).toHaveCount(0);
		await expect(
			page.getByRole("button", { name: "Ouvrir le menu" }),
		).toBeHidden();

		const header = pageHeader(page, FRENCH.githubLabel);
		const githubLink = header.getByRole("link", { name: FRENCH.githubLabel });
		await expect(githubLink).toHaveAttribute("href", REPOSITORY_URL);
		await expect(githubLink.locator("img")).toBeVisible();
		const separator = githubLink.locator("xpath=following-sibling::*[1]");
		await expect(separator).toHaveAttribute("data-orientation", "vertical");
		await expect(
			separator
				.locator("xpath=following-sibling::*[1]")
				.getByRole("img", { name: "fr" })
				.first(),
		).toBeVisible();

		const main = page.getByRole("main");
		await expect(main.getByText("404", { exact: true })).toBeVisible();
		const title = page.getByRole("heading", { level: 1 });
		await expect(title).toHaveText(FRENCH.title);
		const button = main.getByRole("link", { name: FRENCH.button });
		await expect(button).toBeVisible();
		await expect(button).toHaveAttribute("href", FRENCH.homeUrl);
		await button.click();
		await expect(page).toHaveURL(/\/fr\/$/);
		await expect(page.getByRole("heading", { level: 1 })).toHaveText("Moukie");
	}
});

test("The English 404 shows the same header, then “404”, “Page not found” and the “Go home” button, which leads to `/en/`.", async ({
	page,
}) => {
	await page.goto(ENGLISH.url);

	await expect(page).toHaveURL(/\/en\/404\/$/);
	await expect(
		page.getByRole("navigation", { name: "Main navigation" }),
	).toHaveCount(0);

	const header = pageHeader(page, ENGLISH.githubLabel);
	const githubLink = header.getByRole("link", { name: ENGLISH.githubLabel });
	await expect(githubLink).toHaveAttribute("href", REPOSITORY_URL);
	await expect(githubLink.locator("img")).toBeVisible();
	const separator = githubLink.locator("xpath=following-sibling::*[1]");
	await expect(separator).toHaveAttribute("data-orientation", "vertical");
	await expect(
		separator
			.locator("xpath=following-sibling::*[1]")
			.getByRole("img", { name: "en" })
			.first(),
	).toBeVisible();

	const main = page.getByRole("main");
	await expect(main.getByText("404", { exact: true })).toBeVisible();
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(
		ENGLISH.title,
	);
	const button = main.getByRole("link", { name: ENGLISH.button });
	await expect(button).toHaveAttribute("href", ENGLISH.homeUrl);
	await button.click();
	await expect(page).toHaveURL(/\/en\/$/);
	await expect(page.getByRole("heading", { level: 1 })).toHaveText("Moukie");
});

test("On an unknown URL starting with `/en/`, the French 404 switches right away to the English 404. Without JavaScript, it stays in French.", async ({
	page,
	browser,
}) => {
	for (const path of ["en/unknown/", "en/skills/unknown", "en/a/b/c/"]) {
		await page.goto(path);
		await expect(page).toHaveURL(/\/en\/404\/$/);
		await expect(page.locator("html")).toHaveAttribute("lang", "en");
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(
			ENGLISH.title,
		);
	}

	for (const path of ["unknown/", "fr/unknown/", "english/"]) {
		await page.goto(path);
		await page.waitForLoadState("networkidle");
		await expect(page).toHaveURL(new RegExp(`/${path}$`));
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(
			FRENCH.title,
		);
	}

	const context = await browser.newContext({ javaScriptEnabled: false });
	const staticPage = await context.newPage();
	const response = await staticPage.goto("en/unknown/");
	expect(response?.status()).toBe(404);
	await expect(staticPage).toHaveURL(/\/en\/unknown\/$/);
	await expect(staticPage.getByRole("heading", { level: 1 })).toHaveText(
		FRENCH.title,
	);
	await context.close();
});

test("On each 404, the language selector leads to the home page of the other language.", async ({
	page,
}) => {
	const cases = [
		{ url: "404.html", to: "en", home: /\/en\/$/ },
		{ url: "unknown/", to: "en", home: /\/en\/$/ },
		{ url: "fr/agents/unknown/", to: "en", home: /\/en\/$/ },
		{ url: "en/404/", to: "fr", home: /\/fr\/$/ },
	];
	for (const { url, to, home } of cases) {
		await page.goto(url);
		await page.waitForLoadState("networkidle");
		await openLanguageOption(page, to);

		await expect(page, url).toHaveURL(home);
		await expect(page.locator("html")).toHaveAttribute("lang", to);
		await expect(page.getByRole("heading", { level: 1 })).toHaveText("Moukie");
	}
});

test("Each 404 declares its page language and `noindex`, and its tab is titled “Page introuvable · Moukie” or “Page not found · Moukie”.", async ({
	page,
}) => {
	for (const { locale, file, url, documentTitle } of NOT_FOUND_PAGES) {
		const html = readBuiltPage(file);
		expect(html, file).toContain(`<html lang="${locale}">`);
		expect(html, file).toContain(`<title>${documentTitle}</title>`);
		expect(html, file).toMatch(/<meta name="robots" content="noindex"\/?>/);

		await page.goto(url);
		await expect(page).toHaveTitle(documentTitle);
		await expect(page.locator("html")).toHaveAttribute("lang", locale);
		await page.waitForLoadState("networkidle");
		await expect(page.locator('meta[name="robots"]')).toHaveCount(1);
		await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
			"content",
			"noindex",
		);
	}

	await page.goto("unknown/");
	await page.waitForLoadState("networkidle");
	await expect(page).toHaveTitle("Page introuvable · Moukie");
	await expect(page.locator("html")).toHaveAttribute("lang", "fr");
	await expect(page.locator('meta[name="robots"]')).toHaveCount(1);
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		"noindex",
	);
});

test("Below 768 px, the content fits the width, without horizontal scrolling.", async ({
	page,
}) => {
	for (const { url, locale } of NOT_FOUND_PAGES) {
		await page.goto(url);
		for (const width of [767, 500, 375, 320]) {
			await page.setViewportSize({ width, height: 800 });
			const overflow = await page.evaluate(
				() =>
					document.documentElement.scrollWidth -
					document.documentElement.clientWidth,
			);
			expect(overflow, `${locale} ${width}px`).toBeLessThanOrEqual(0);
			await expect(page.getByRole("main").getByRole("link")).toBeVisible();
		}
	}
});

test("On desktop, the rendering matches the mockup: fonts, sizes, colors, spacing. Only the texts of the French version differ.", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1512, height: 982 });
	await page.goto(ENGLISH.url);
	await page.evaluate(() => document.fonts.ready);

	const main = page.getByRole("main");
	const code = main.getByText("404", { exact: true });
	const title = page.getByRole("heading", { level: 1 });
	const button = main.getByRole("link", { name: ENGLISH.button });

	await expect(code).toHaveCSS("font-family", /Geist/);
	await expect(code).toHaveCSS("font-size", "96px");
	await expect(code).toHaveCSS("font-weight", "700");
	await expect(code).toHaveCSS("color", "rgb(255, 203, 240)");
	await expect(code).toHaveCSS("-webkit-text-stroke-color", "rgb(27, 25, 25)");

	await expect(title).toHaveCSS("font-family", /Geist/);
	await expect(title).toHaveCSS("font-size", "32px");
	await expect(title).toHaveCSS("font-weight", "700");
	await expect(title).toHaveCSS("color", "rgb(27, 25, 25)");

	await expect(button).toHaveCSS("font-family", /Geist/);
	await expect(button).toHaveCSS("font-size", "28px");
	await expect(button).toHaveCSS("font-weight", "500");
	await expect(button).toHaveCSS("color", "rgb(255, 255, 255)");
	await expect(button).toHaveCSS("background-color", "rgb(27, 25, 25)");
	await expect(button).toHaveCSS("border-top-left-radius", "6px");
	await expect(button).toHaveCSS("padding", "12px 48px");

	const codeBox = await code.boundingBox();
	const titleBox = await title.boundingBox();
	const buttonBox = await button.boundingBox();
	const githubBox = await page
		.getByRole("link", { name: ENGLISH.githubLabel })
		.boundingBox();

	expect(githubBox?.x).toBeCloseTo(1287, 0);
	expect(githubBox?.y).toBeCloseTo(32, 0);
	expect(githubBox?.width).toBeCloseTo(64, 0);
	expect(Math.abs((codeBox?.height ?? 0) - 125)).toBeLessThanOrEqual(1);
	expect(Math.abs((titleBox?.height ?? 0) - 42)).toBeLessThanOrEqual(1);
	expect(Math.abs((buttonBox?.height ?? 0) - 58)).toBeLessThanOrEqual(3);
	expect(
		(titleBox?.y ?? 0) - ((codeBox?.y ?? 0) + (codeBox?.height ?? 0)),
	).toBeCloseTo(40, 0);
	expect(
		(buttonBox?.y ?? 0) - ((titleBox?.y ?? 0) + (titleBox?.height ?? 0)),
	).toBeCloseTo(40, 0);

	const contentTop = codeBox?.y ?? 0;
	const contentBottom = (buttonBox?.y ?? 0) + (buttonBox?.height ?? 0);
	expect((contentTop + contentBottom) / 2).toBeCloseTo(32 + 64 + 427, 0);
	for (const box of [codeBox, titleBox, buttonBox]) {
		expect((box?.x ?? 0) + (box?.width ?? 0) / 2).toBeCloseTo(756, 0);
	}
	expect(Math.abs((codeBox?.width ?? 0) - 194)).toBeLessThanOrEqual(3);
	expect(Math.abs((titleBox?.width ?? 0) - 238)).toBeLessThanOrEqual(2);
	expect(Math.abs((buttonBox?.width ?? 0) - 217)).toBeLessThanOrEqual(6);
});
