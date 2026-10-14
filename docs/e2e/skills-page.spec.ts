import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, type Page, test } from "@playwright/test";

const SKILLS_URL = "fr/skills";

const EXPECTED_CARDS = [
	{
		name: "setup",
		badge: "Projet",
		summary: "Mène l'entretien de départ et configure tout le workflow.",
		produces: "Crée project/ et CLAUDE.md",
	},
	{
		name: "product",
		badge: "Projet",
		summary: "Challenge ton produit, avec une veille sur l'existant.",
		produces: "Crée product.md et market.md",
	},
	{
		name: "stack",
		badge: "Projet",
		summary: "Confronte la stack au produit, versions et licences vérifiées.",
		produces: "Crée stack.md",
	},
	{
		name: "architecture",
		badge: "Projet",
		summary: "Apps, dépôt, découpage du front et du back, modules, contrat.",
		produces: "Crée architecture.md",
	},
	{
		name: "scaffold",
		badge: "Projet",
		summary: "Génère les apps qui manquent, sans toucher au code existant.",
	},
	{
		name: "spec",
		badge: "Feature",
		summary: "Cadre une feature et la découpe en stories.",
		produces: "Crée project/specs/",
	},
	{
		name: "orchestrator",
		badge: "Story",
		summary: "Une lane par app, en parallèle, jusqu'à la PR.",
		produces: "Appelle contract et pr",
	},
	{
		name: "contract",
		badge: "Story",
		summary: "Gèle l'interface entre les apps avant le travail parallèle.",
	},
	{
		name: "pr",
		badge: "Story",
		summary: "Commite, pousse et ouvre la PR. Ne merge jamais.",
	},
];

const EXPECTED_NAMES = EXPECTED_CARDS.map((card) => card.name);

const KNOWLEDGE_SKILLS = [
	"naming-conventions",
	"feature-sliced-design",
	"figma-annotations",
];

function cards(page: Page) {
	return page.getByRole("main").getByRole("listitem");
}

function cardNames(page: Page) {
	return page.getByRole("main").getByRole("heading", { level: 2 });
}

test.beforeEach(async ({ page }) => {
	await page.goto(SKILLS_URL);
});

test("`/moukie/fr/skills` affiche le titre « Skills », puis l'introduction : « Un skill est une compétence de Moukie. Tu n'as pas besoin de les appeler par leur nom : ils se déclenchent sur ce que tu dis. Tu peux aussi les invoquer directement, avec /moukie:<skill>. »", async ({
	page,
}) => {
	await expect(page).toHaveURL(/\/moukie\/fr\/skills$/);
	const title = page.getByRole("heading", { level: 1 });
	await expect(title).toHaveText("Skills");
	const introduction = title.locator("xpath=following-sibling::*[1]");
	await expect(introduction).toHaveText(
		"Un skill est une compétence de Moukie. Tu n'as pas besoin de les appeler par leur nom : ils se déclenchent sur ce que tu dis. Tu peux aussi les invoquer directement, avec /moukie:<skill>.",
	);
});

test("La page affiche une carte par skill du plugin dont le badge n'est pas `knowledge`, soit 9 aujourd'hui.", async ({
	page,
}) => {
	await expect(cards(page)).toHaveCount(9);
});

test("Les cartes sont triées par rang croissant. À rang égal, elles sont départagées par nom.", async ({
	page,
}) => {
	await expect(cardNames(page)).toHaveText(EXPECTED_NAMES);
});

test("Chaque carte affiche l'icône Lucide du skill, son nom, le libellé de son badge (Projet, Feature ou Story), son résumé et, seulement si `moukie-produces` est renseigné, une ligne précédée d'une flèche avec ce qu'il produit.", async ({
	page,
}) => {
	for (const [index, expected] of EXPECTED_CARDS.entries()) {
		const card = cards(page).nth(index);
		await expect(card.locator("svg").first()).toBeVisible();
		await expect(card.getByRole("heading", { level: 2 })).toHaveText(
			expected.name,
		);
		await expect(card.getByText(expected.badge, { exact: true })).toBeVisible();
		await expect(
			card.getByText(expected.summary, { exact: true }),
		).toBeVisible();
		const producesLine = card.locator("svg.lucide-arrow-big-right");
		if (expected.produces) {
			await expect(producesLine).toBeVisible();
			await expect(
				producesLine.locator("xpath=following-sibling::*[1]"),
			).toHaveText(expected.produces);
		} else {
			await expect(producesLine).toHaveCount(0);
		}
	}
});

test("Les skills `knowledge` n'apparaissent pas.", async ({ page }) => {
	for (const name of KNOWLEDGE_SKILLS) {
		await expect(
			page.getByRole("heading", { level: 2, name, exact: true }),
		).toHaveCount(0);
	}
});

test("Au survol, la bordure pointillée de la carte devient pleine et une ombre pleine, de la couleur de la bordure, la décale vers le bas et la droite. Elle reprend son aspect au départ du pointeur.", async ({
	page,
}) => {
	const card = cards(page).first();
	await expect(card).toHaveCSS("border-top-style", "dashed");
	await expect(card).toHaveCSS("box-shadow", "none");

	await card.hover();
	await expect(card).toHaveCSS("border-top-style", "solid");
	const borderColor = await card.evaluate(
		(element) => getComputedStyle(element).borderTopColor,
	);
	await expect(card).toHaveCSS(
		"box-shadow",
		new RegExp(
			`^${borderColor.replace(/[()]/g, "\\$&")} \\d+px \\d+px 0px 0px$`,
		),
	);
	const [offsetX, offsetY] = (await card.evaluate((element) =>
		getComputedStyle(element)
			.boxShadow.match(/(\d+)px (\d+)px/)
			?.slice(1)
			.map(Number),
	)) ?? [0, 0];
	expect(offsetX).toBeGreaterThan(0);
	expect(offsetY).toBeGreaterThan(0);

	await page.mouse.move(0, 0);
	await expect(card).toHaveCSS("border-top-style", "dashed");
	await expect(card).toHaveCSS("box-shadow", "none");
});

test("Une carte n'est ni un lien ni un élément focalisable, et le curseur reste celui par défaut.", async ({
	page,
}) => {
	const card = cards(page).first();
	await expect(card.locator("a, button, [tabindex]")).toHaveCount(0);
	expect(await card.evaluate((element) => element.closest("a"))).toBeNull();
	expect(await card.evaluate((element) => element.tabIndex)).toBe(-1);
	await card.hover();
	await expect(card).toHaveCSS("cursor", "default");

	await card.click();
	await expect(page).toHaveURL(/\/moukie\/fr\/skills$/);
	for (let step = 0; step < 12; step += 1) {
		await page.keyboard.press("Tab");
		const isInsideCard = await page.evaluate(
			() => document.activeElement?.closest("[role='listitem']") != null,
		);
		expect(isInsideCard).toBe(false);
	}
});

test("La page est pré-rendue : son HTML contient les 9 cartes sans exécuter de JavaScript.", async ({
	browser,
}) => {
	const html = readFileSync(
		resolve(import.meta.dirname, "../dist/client/fr/skills/index.html"),
		"utf8",
	);
	const prerenderedNames = [...html.matchAll(/<h2[^>]*>([^<]+)<\/h2>/g)].map(
		([, name]) => name,
	);
	expect(prerenderedNames).toEqual(EXPECTED_NAMES);

	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto(SKILLS_URL);
	await expect(cardNames(page)).toHaveText(EXPECTED_NAMES);
	await context.close();
});

test("L'onglet du navigateur s'intitule « Skills · Moukie » et la page déclare `lang=\"fr\"`.", async ({
	page,
}) => {
	await expect(page).toHaveTitle("Skills · Moukie");
	await expect(page.locator("html")).toHaveAttribute("lang", "fr");
});

test("Sur desktop, le rendu correspond à la maquette : polices, tailles, couleurs, bordures pointillées, espacements.", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1512, height: 1173 });
	await page.evaluate(() => document.fonts.ready);

	const title = page.getByRole("heading", { level: 1 });
	await expect(title).toHaveCSS("font-family", /Geist/);
	await expect(title).toHaveCSS("font-size", "64px");
	await expect(title).toHaveCSS("font-weight", "700");
	await expect(title).toHaveCSS("color", "rgb(255, 203, 240)");
	await expect(title).toHaveCSS("-webkit-text-stroke-color", "rgb(27, 25, 25)");

	const introduction = title.locator("xpath=following-sibling::*[1]");
	await expect(introduction).toHaveCSS("font-size", "20px");
	await expect(introduction).toHaveCSS("font-weight", "500");
	await expect(introduction).toHaveCSS("color", "rgb(27, 25, 25)");

	const grid = page.getByRole("main").getByRole("list");
	await expect(grid).toHaveCSS("column-gap", "40px");
	await expect(grid).toHaveCSS("row-gap", "40px");

	const card = cards(page).first();
	await expect(card).toHaveCSS("background-color", "rgb(255, 255, 255)");
	await expect(card).toHaveCSS("border-top-width", "2px");
	await expect(card).toHaveCSS("border-top-style", "dashed");
	await expect(card).toHaveCSS("border-top-color", "rgb(27, 25, 25)");
	await expect(card).toHaveCSS("border-top-left-radius", "8px");
	await expect(card).toHaveCSS("row-gap", "32px");
	const contentOffset = await card.evaluate((element) => {
		const header = element.firstElementChild;
		return header
			? header.getBoundingClientRect().left -
					element.getBoundingClientRect().left
			: 0;
	});
	expect(contentOffset).toBe(24);

	await expect(card.getByRole("heading", { level: 2 })).toHaveCSS(
		"font-size",
		"24px",
	);
	await expect(card.getByRole("heading", { level: 2 })).toHaveCSS(
		"font-weight",
		"700",
	);
	const badge = card.getByText("Projet", { exact: true });
	await expect(badge).toHaveCSS("font-size", "14px");
	await expect(badge).toHaveCSS("font-weight", "500");
	await expect(badge).toHaveCSS("background-color", "rgb(27, 25, 25)");
	await expect(badge).toHaveCSS("color", "rgb(255, 255, 255)");
	await expect(card.getByText(EXPECTED_CARDS[0].summary)).toHaveCSS(
		"font-size",
		"20px",
	);
	await expect(card.getByText(EXPECTED_CARDS[0].produces ?? "")).toHaveCSS(
		"font-size",
		"16px",
	);

	const activeEntry = page
		.getByRole("navigation")
		.getByRole("link", { name: "Skills" });
	await expect(activeEntry).toHaveCSS("background-color", "rgb(23, 23, 23)");
	await expect(activeEntry.getByText("Skills")).toHaveCSS("font-size", "20px");
	await expect(activeEntry.getByText("Skills")).toHaveCSS("font-weight", "700");
	await expect(page.getByText("Moukie", { exact: true })).toHaveCSS(
		"font-size",
		"32px",
	);

	await page.screenshot({
		path: resolve(import.meta.dirname, "../test-results/skills-desktop.png"),
		fullPage: true,
	});
});

test("hydrates the prerendered page without calling a server function or logging an error", async ({
	browser,
}) => {
	const context = await browser.newContext();
	const page = await context.newPage();
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

	await page.goto(SKILLS_URL);
	await page.waitForLoadState("networkidle");
	await page
		.getByRole("navigation")
		.getByRole("link", { name: "Skills" })
		.hover();
	await page.waitForLoadState("networkidle");

	expect(serverFunctionRequests).toEqual([]);
	expect(errors).toEqual([]);
	await context.close();
});
