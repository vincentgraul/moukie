import { expect, type Page, test } from "@playwright/test";

const SKILLS_URL = "fr/skills/";
const REPOSITORY_URL = "https://github.com/vincentgraul/moukie";
const NAVIGATION_ENTRIES = [
	"Getting started",
	"Skills",
	"Agents",
	"Workflow map",
];
const DISABLED_ENTRIES = ["Getting started", "Agents", "Workflow map"];

function sidebar(page: Page) {
	return page.getByRole("navigation", { name: "Navigation principale" });
}

function navigationEntries(page: Page) {
	return sidebar(page).getByRole("listitem");
}

async function countGridColumns(page: Page) {
	return page
		.getByRole("main")
		.getByRole("list")
		.evaluate(
			(grid) =>
				getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean)
					.length,
		);
}

test.beforeEach(async ({ page }) => {
	await page.goto(SKILLS_URL);
});

test("La barre latérale affiche le logo, « Moukie », puis les entrées Getting started, Skills, Agents et Workflow map, avec leurs icônes.", async ({
	page,
}) => {
	const logo = sidebar(page).locator("header img");
	await expect(logo).toBeVisible();
	expect(
		await logo.evaluate((image: HTMLImageElement) => image.naturalWidth),
	).toBeGreaterThan(0);
	await expect(sidebar(page).locator("header")).toHaveText("Moukie");
	await expect(navigationEntries(page)).toHaveText(NAVIGATION_ENTRIES);
	for (const [index] of NAVIGATION_ENTRIES.entries()) {
		await expect(
			navigationEntries(page).nth(index).locator("svg.lucide"),
		).toBeVisible();
	}
});

test("L'entrée de la page courante est mise en évidence comme dans la maquette.", async ({
	page,
}) => {
	const skillsEntry = sidebar(page).getByRole("link", { name: "Skills" });
	await expect(skillsEntry).toHaveAttribute("aria-current", "page");
	await expect(skillsEntry).toHaveAttribute("data-active", "true");
	await expect(skillsEntry).toHaveCSS("background-color", "rgb(23, 23, 23)");
	await expect(skillsEntry).toHaveCSS("color", "rgb(255, 255, 255)");
	await expect(skillsEntry).toHaveCSS("border-top-left-radius", "6px");
	for (const name of DISABLED_ENTRIES) {
		await expect(sidebar(page).getByRole("button", { name })).toHaveCSS(
			"background-color",
			"rgba(0, 0, 0, 0)",
		);
	}
});

test("Une entrée dont la page n'existe pas encore est affichée désactivée et n'est pas cliquable : dans cette story, Getting started, Agents et Workflow map.", async ({
	page,
}) => {
	for (const name of DISABLED_ENTRIES) {
		const entry = sidebar(page).getByRole("button", { name });
		await expect(entry).toBeDisabled();
		await expect(entry).toHaveCSS("opacity", "0.5");
		await expect(sidebar(page).getByRole("link", { name })).toHaveCount(0);
		await entry.click({ force: true });
		await expect(page).toHaveURL(/\/moukie\/fr\/skills\/$/);
	}
	await expect(
		sidebar(page).getByRole("link", { name: "Skills" }),
	).toBeEnabled();
});

test("L'en-tête affiche l'icône GitHub, qui ouvre https://github.com/vincentgraul/moukie dans un nouvel onglet, puis un séparateur et le sélecteur de langue au drapeau français.", async ({
	page,
	context,
}) => {
	await context.route(`${REPOSITORY_URL}**`, (route) =>
		route.fulfill({ contentType: "text/html", body: "<title>GitHub</title>" }),
	);
	const header = page.locator("header").filter({
		has: page.getByRole("link", { name: "Moukie sur GitHub" }),
	});
	const githubLink = header.getByRole("link", { name: "Moukie sur GitHub" });
	await expect(githubLink).toHaveAttribute("href", REPOSITORY_URL);
	await expect(githubLink).toHaveAttribute("target", "_blank");
	await expect(githubLink).toHaveAttribute("rel", /noopener/);
	await expect(githubLink.locator("img")).toBeVisible();

	const separator = githubLink.locator("xpath=following-sibling::*[1]");
	await expect(separator).toHaveAttribute("data-orientation", "vertical");
	await expect(separator).toHaveCSS("width", "3px");

	const languageSelector = separator.locator("xpath=following-sibling::*[1]");
	const flag = languageSelector.getByRole("img", { name: "fr" }).first();
	await expect(flag).toBeVisible();
	expect(
		await flag
			.locator("img")
			.evaluate((image: HTMLImageElement) => image.naturalWidth),
	).toBeGreaterThan(0);

	const popupPromise = page.waitForEvent("popup");
	await githubLink.click();
	const popup = await popupPromise;
	await expect(popup).toHaveURL(REPOSITORY_URL);
	await expect(page).toHaveURL(/\/moukie\/fr\/skills\/$/);
});

test("labels the language selector and keeps the header still while the page hydrates", async ({
	page,
	browser,
}) => {
	const trigger = page.getByRole("button", { name: /^Langue/ });
	await expect(trigger).toBeVisible();
	await expect(trigger).toHaveAccessibleName(/^Langue/);

	const measureHeader = async (target: Page) => {
		const languageTrigger = target.locator("header button[aria-labelledby]");
		const githubLink = target.getByRole("link", { name: "Moukie sur GitHub" });
		const triggerBox = await languageTrigger.boundingBox();
		const githubBox = await githubLink.boundingBox();
		return {
			triggerWidth: triggerBox?.width,
			triggerHeight: triggerBox?.height,
			githubX: githubBox?.x,
			githubY: githubBox?.y,
		};
	};

	await page.setViewportSize({ width: 1512, height: 1000 });
	const hydrated = await measureHeader(page);

	const context = await browser.newContext({
		javaScriptEnabled: false,
		viewport: { width: 1512, height: 1000 },
	});
	const staticPage = await context.newPage();
	await staticPage.goto(SKILLS_URL);
	const prerendered = await measureHeader(staticPage);
	const prerenderedFlag = await staticPage
		.locator("header button[aria-labelledby] > span")
		.first()
		.evaluate((span) => getComputedStyle(span).backgroundImage);
	await context.close();

	expect(hydrated.triggerWidth).toBe(78);
	expect(prerendered).toEqual(hydrated);
	expect(prerenderedFlag).toMatch(/^url\(/);
});

test("À partir de 1200 px de large, la grille a 3 colonnes. Entre 768 et 1199 px, elle en a 2. En dessous de 768 px, elle en a 1.", async ({
	page,
}) => {
	const expectations = [
		{ width: 1300, columns: 3 },
		{ width: 1200, columns: 3 },
		{ width: 1199, columns: 2 },
		{ width: 900, columns: 2 },
		{ width: 768, columns: 2 },
		{ width: 767, columns: 1 },
		{ width: 500, columns: 1 },
	];
	for (const { width, columns } of expectations) {
		await page.setViewportSize({ width, height: 900 });
		await expect
			.poll(() => countGridColumns(page), { message: `${width}px` })
			.toBe(columns);
	}
});

test("En dessous de 768 px, la barre latérale est remplacée par un bouton qui ouvre et ferme un menu contenant les mêmes entrées.", async ({
	page,
}) => {
	const menuButton = page.getByRole("button", { name: "Ouvrir le menu" });

	await page.setViewportSize({ width: 1024, height: 900 });
	await expect(sidebar(page)).toBeVisible();
	await expect(menuButton).toBeHidden();

	await page.setViewportSize({ width: 500, height: 900 });
	await expect(sidebar(page)).toBeHidden();
	await expect(menuButton).toBeVisible();
	await expect(menuButton).toHaveAttribute("aria-expanded", "false");

	await menuButton.click();
	const closeButton = page.getByRole("button", { name: "Fermer le menu" });
	await expect(closeButton).toHaveAttribute("aria-expanded", "true");
	const menu = sidebar(page);
	await expect(menu).toBeVisible();
	await expect(menu.getByRole("listitem")).toHaveText(NAVIGATION_ENTRIES);
	await expect(menu.getByRole("link", { name: "Skills" })).toHaveAttribute(
		"aria-current",
		"page",
	);
	for (const name of DISABLED_ENTRIES) {
		await expect(menu.getByRole("button", { name })).toBeDisabled();
	}

	await closeButton.click();
	await expect(menu).toBeHidden();
	await expect(menuButton).toHaveAttribute("aria-expanded", "false");
});
