import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";

const SKILLS_URL = /\/moukie\/fr\/skills\/$/;
const AGENTS_URL = /\/moukie\/fr\/agents\/$/;

function readPrerenderedPage(path: string) {
	return readFileSync(
		resolve(import.meta.dirname, "../dist/client", path, "index.html"),
		"utf8",
	);
}

test("`/moukie/` et `/moukie/fr/` redirigent vers `/moukie/fr/skills`.", async ({
	page,
	browser,
}) => {
	for (const path of ["", "fr/"]) {
		expect(readPrerenderedPage(path)).toContain(
			'<meta http-equiv="refresh" content="0; url=/moukie/fr/skills/"/>',
		);

		await page.goto(path);
		await expect(page).toHaveURL(SKILLS_URL);
		await expect(page.getByRole("heading", { level: 1 })).toHaveText("Skills");

		const context = await browser.newContext({ javaScriptEnabled: false });
		const staticPage = await context.newPage();
		await staticPage.goto(path);
		await expect(staticPage).toHaveURL(SKILLS_URL);
		await context.close();
	}
});

test("redirects a page asked without its trailing slash, as GitHub Pages does, and renders it", async ({
	page,
}) => {
	const serverFunctionRequests: string[] = [];
	const errors: string[] = [];
	page.on("request", (request) => {
		if (request.url().includes("_serverFn")) {
			serverFunctionRequests.push(request.url());
		}
	});
	page.on("console", (message) => {
		if (message.type() === "error") {
			errors.push(message.text());
		}
	});
	page.on("pageerror", (error) => errors.push(error.message));

	const pages = [
		{ path: "fr/skills", url: SKILLS_URL, title: "Skills", cardCount: 9 },
		{ path: "fr/agents", url: AGENTS_URL, title: "Agents", cardCount: 4 },
	];
	for (const { path, url, title, cardCount } of pages) {
		const response = await page.goto(path);
		const redirect = await response?.request().redirectedFrom()?.response();
		expect(redirect?.status(), path).toBe(301);
		await expect(page).toHaveURL(url);
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
		await expect(page.getByRole("main").getByRole("listitem")).toHaveCount(
			cardCount,
		);
		await page.waitForLoadState("networkidle");
	}

	expect(serverFunctionRequests).toEqual([]);
	expect(errors).toEqual([]);
});

test("links to internal pages with a trailing slash, so that no click goes through a redirect", async ({
	page,
}) => {
	for (const path of ["fr/skills/", "fr/agents/"]) {
		await page.goto(path);
		const internalLinks = await page
			.locator("a[href^='/moukie/']")
			.evaluateAll((links) =>
				links.map((link) => link.getAttribute("href") ?? ""),
			);

		expect(internalLinks, path).toContain("/moukie/fr/agents/");
		for (const href of internalLinks) {
			expect(href).toMatch(/\/$/);
		}
	}
});

test("renders a single main landmark on each built page", () => {
	for (const path of ["", "fr/", "fr/skills/", "fr/agents/"]) {
		const html = readPrerenderedPage(path);
		expect(html.match(/<main[\s>]/g), path || "/").toHaveLength(1);
	}
});

test("redirects the site root asked without its trailing slash, as GitHub Pages does", async ({
	page,
}) => {
	const response = await page.request.get("/moukie", { maxRedirects: 0 });
	expect(response.status()).toBe(301);
	expect(response.headers().location).toBe("/moukie/");

	await page.goto("/moukie");
	await expect(page).toHaveURL(SKILLS_URL);
});
