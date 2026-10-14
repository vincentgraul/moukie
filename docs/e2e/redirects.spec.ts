import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";

const SKILLS_URL = /\/moukie\/fr\/skills$/;

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
			'<meta http-equiv="refresh" content="0; url=/moukie/fr/skills"/>',
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
