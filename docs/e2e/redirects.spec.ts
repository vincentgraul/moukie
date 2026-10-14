import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";

const SKILLS_URL = /\/moukie\/fr\/skills\/$/;

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

	const response = await page.goto("fr/skills");
	const redirect = await response?.request().redirectedFrom()?.response();
	expect(redirect?.status()).toBe(301);
	await expect(page).toHaveURL(SKILLS_URL);
	await expect(page.getByRole("heading", { level: 1 })).toHaveText("Skills");
	await expect(page.getByRole("main").getByRole("listitem")).toHaveCount(9);
	await page.waitForLoadState("networkidle");

	expect(serverFunctionRequests).toEqual([]);
	expect(errors).toEqual([]);
});

test("links to internal pages with a trailing slash, so that no click goes through a redirect", async ({
	page,
}) => {
	await page.goto("fr/skills/");
	const internalLinks = await page
		.locator("a[href^='/moukie/']")
		.evaluateAll((links) =>
			links.map((link) => link.getAttribute("href") ?? ""),
		);

	expect(internalLinks.length).toBeGreaterThan(0);
	for (const href of internalLinks) {
		expect(href).toMatch(/\/$/);
	}
});

test("renders a single main landmark on each built page", () => {
	for (const path of ["", "fr/", "fr/skills/"]) {
		const html = readPrerenderedPage(path);
		expect(html.match(/<main[\s>]/g), path || "/").toHaveLength(1);
	}
});
