import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, type Locator, type Page, test } from "@playwright/test";

const AGENTS_URL = "fr/agents/";
const SKILLS_URL = "fr/skills/";

const EXPECTED_CARDS = [
	{
		name: "backend",
		icon: "server",
		badge: "Lane",
		summary: "Code la partie serveur d'une story, contre le contrat gelé.",
		produces: "Commite le code serveur et ses tests",
	},
	{
		name: "front-web",
		icon: "panel-top",
		badge: "Lane",
		summary: "Code l'interface web d'une story avec le design system.",
		produces: "Commite l'interface web et ses tests",
	},
	{
		name: "front-mobile",
		icon: "smartphone",
		badge: "Lane",
		summary: "Code l'interface mobile d'une story, une instance par app.",
		produces: "Commite l'interface mobile et ses tests",
	},
	{
		name: "reviewer",
		icon: "eye",
		badge: "Review",
		summary: "Relit toute la story avant la PR, sans rien corriger.",
		produces: "Rend des constats classés en trois niveaux",
	},
];

const EXPECTED_NAMES = EXPECTED_CARDS.map((card) => card.name);

const INTRODUCTION =
	"Les agents sont ceux qui codent. Tu ne les appelles jamais : l'orchestrateur les lance pour chaque story, un par app concernée, en parallèle, chacun dans sa propre copie du dépôt. Ils suivent ta stack, ton architecture et le contrat entre les apps, écrivent leurs tests d'abord, et ne mergent jamais rien.";

const CARD_STYLE_PROPERTIES = [
	"background-color",
	"border-top-width",
	"border-top-style",
	"border-top-color",
	"border-top-left-radius",
	"padding-top",
	"padding-left",
	"row-gap",
	"cursor",
	"box-shadow",
];

function cards(page: Page) {
	return page.getByRole("main").getByRole("listitem");
}

function cardNames(page: Page) {
	return page.getByRole("main").getByRole("heading", { level: 2 });
}

function sidebar(page: Page) {
	return page.getByRole("navigation", { name: "Navigation principale" });
}

function readCardStyle(card: Locator) {
	return card.evaluate((element, properties) => {
		const style = getComputedStyle(element);
		return Object.fromEntries(
			properties.map((property) => [
				property,
				style.getPropertyValue(property),
			]),
		);
	}, CARD_STYLE_PROPERTIES);
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
	await page.goto(AGENTS_URL);
});

test("`/fr/agents` shows the title “Agents”, then the introduction: “Les agents sont ceux qui codent. Tu ne les appelles jamais : l'orchestrateur les lance pour chaque story, un par app concernée, en parallèle, chacun dans sa propre copie du dépôt. Ils suivent ta stack, ton architecture et le contrat entre les apps, écrivent leurs tests d'abord, et ne mergent jamais rien.”", async ({
	page,
}) => {
	await expect(page).toHaveURL(/\/fr\/agents\/$/);
	const title = page.getByRole("heading", { level: 1 });
	await expect(title).toHaveText("Agents");
	const introduction = title.locator("xpath=following-sibling::*[1]");
	await expect(introduction).toHaveText(INTRODUCTION);
});

test("The page shows one card per plugin agent, sorted by ascending rank: backend, front-web, front-mobile, reviewer.", async ({
	page,
}) => {
	await expect(cards(page)).toHaveCount(4);
	await expect(cardNames(page)).toHaveText(EXPECTED_NAMES);
});

test("Each card shows the agent's Lucide icon, its name, its badge label (Lane or Review), its summary and, only when `moukie-produces` is set, a line preceded by an arrow with what it produces.", async ({
	page,
}) => {
	for (const [index, expected] of EXPECTED_CARDS.entries()) {
		const card = cards(page).nth(index);
		const icon = card.locator(`svg.lucide-${expected.icon}`);
		await expect(icon).toHaveCount(1);
		await expect(icon).toBeVisible();
		await expect(card.locator("svg[class*='lucide-']").first()).toHaveClass(
			new RegExp(`\\blucide-${expected.icon}\\b`),
		);
		await expect(card.getByRole("heading", { level: 2 })).toHaveText(
			expected.name,
		);
		await expect(card.getByText(expected.badge, { exact: true })).toBeVisible();
		await expect(
			card.getByText(expected.summary, { exact: true }),
		).toBeVisible();
		const producesLine = card.locator("svg.lucide-arrow-big-right");
		await expect(producesLine).toBeVisible();
		await expect(
			producesLine.locator("xpath=following-sibling::*[1]"),
		).toHaveText(expected.produces);
	}
});

test("The cards have the same look, the same hover and the same lack of interaction as those of the Skills page.", async ({
	page,
	browser,
}) => {
	await page.setViewportSize({ width: 1512, height: 1000 });
	const card = cards(page).first();

	const skillsContext = await browser.newContext({
		viewport: { width: 1512, height: 1000 },
	});
	const skillsPage = await skillsContext.newPage();
	await skillsPage.goto(SKILLS_URL);
	const skillCard = cards(skillsPage).first();
	expect(await readCardStyle(card)).toEqual(await readCardStyle(skillCard));
	await expect(card).toHaveCSS("border-top-style", "dashed");
	await expect(card).toHaveCSS("box-shadow", "none");

	await card.hover();
	await skillCard.hover();
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
	const hoveredShadow = await card.evaluate(
		(element) => getComputedStyle(element).boxShadow,
	);
	await expect(skillCard).toHaveCSS("border-top-style", "solid");
	await expect(skillCard).toHaveCSS("box-shadow", hoveredShadow);
	expect(await readCardStyle(card)).toEqual(await readCardStyle(skillCard));
	await skillsContext.close();

	await page.mouse.move(0, 0);
	await expect(card).toHaveCSS("border-top-style", "dashed");
	await expect(card).toHaveCSS("box-shadow", "none");

	await expect(card.locator("a, button, [tabindex]")).toHaveCount(0);
	expect(await card.evaluate((element) => element.closest("a"))).toBeNull();
	expect(await card.evaluate((element) => element.tabIndex)).toBe(-1);
	await card.hover();
	await expect(card).toHaveCSS("cursor", "default");
	await card.click();
	await expect(page).toHaveURL(/\/fr\/agents\/$/);
	for (let step = 0; step < 12; step += 1) {
		await page.keyboard.press("Tab");
		const isInsideCard = await page.evaluate(
			() => document.activeElement?.closest("[role='listitem']") != null,
		);
		expect(isInsideCard).toBe(false);
	}
});

test("The Agents sidebar entry is clickable from every page, and highlighted on the Agents page.", async ({
	page,
}) => {
	for (const path of [SKILLS_URL, AGENTS_URL]) {
		await page.goto(path);
		const agentsEntry = sidebar(page).getByRole("link", { name: "Agents" });
		await expect(agentsEntry).toBeEnabled();
		await expect(agentsEntry).toHaveAttribute("href", "/fr/agents/");
	}

	await page.goto(SKILLS_URL);
	await expect(
		sidebar(page).getByRole("link", { name: "Agents" }),
	).not.toHaveAttribute("aria-current", "page");
	await sidebar(page).getByRole("link", { name: "Agents" }).click();
	await expect(page).toHaveURL(/\/fr\/agents\/$/);
	await expect(page.getByRole("heading", { level: 1 })).toHaveText("Agents");

	const agentsEntry = sidebar(page).getByRole("link", { name: "Agents" });
	await expect(agentsEntry).toHaveAttribute("aria-current", "page");
	await expect(agentsEntry).toHaveAttribute("data-active", "true");
	await expect(agentsEntry).toHaveCSS("background-color", "rgb(23, 23, 23)");
	await expect(agentsEntry).toHaveCSS("color", "rgb(255, 255, 255)");
	const skillsEntry = sidebar(page).getByRole("link", { name: "Skills" });
	await expect(skillsEntry).not.toHaveAttribute("aria-current", "page");
	await expect(skillsEntry).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");

	await skillsEntry.click();
	await expect(page).toHaveURL(/\/fr\/skills\/$/);
});

test("The grid and the mobile menu follow the same breakpoints as the Skills page.", async ({
	page,
}) => {
	const menuButton = page.getByRole("button", { name: "Ouvrir le menu" });
	const expectations = [
		{ width: 1300, columns: 3, hasSidebar: true },
		{ width: 1200, columns: 3, hasSidebar: true },
		{ width: 1199, columns: 2, hasSidebar: true },
		{ width: 900, columns: 2, hasSidebar: true },
		{ width: 768, columns: 2, hasSidebar: true },
		{ width: 767, columns: 1, hasSidebar: false },
		{ width: 500, columns: 1, hasSidebar: false },
	];
	for (const { width, columns, hasSidebar } of expectations) {
		await page.setViewportSize({ width, height: 900 });
		await expect
			.poll(() => countGridColumns(page), { message: `${width}px` })
			.toBe(columns);
		if (hasSidebar) {
			await expect(sidebar(page)).toBeVisible();
			await expect(menuButton).toBeHidden();
		} else {
			await expect(sidebar(page)).toBeHidden();
			await expect(menuButton).toBeVisible();
		}
	}

	await menuButton.click();
	const closeButton = page.getByRole("button", { name: "Fermer le menu" });
	await expect(closeButton).toHaveAttribute("aria-expanded", "true");
	const menu = sidebar(page);
	await expect(menu.getByRole("listitem")).toHaveText([
		"Getting started",
		"Skills",
		"Agents",
		"Workflow map",
	]);
	await expect(menu.getByRole("link", { name: "Agents" })).toHaveAttribute(
		"aria-current",
		"page",
	);
	await closeButton.click();
	await expect(menu).toBeHidden();
});

test("The page is prerendered: its HTML contains the 4 cards without running any JavaScript.", async ({
	browser,
}) => {
	const html = readFileSync(
		resolve(import.meta.dirname, "../dist/client/fr/agents/index.html"),
		"utf8",
	);
	const prerenderedNames = [...html.matchAll(/<h2[^>]*>([^<]+)<\/h2>/g)].map(
		([, name]) => name,
	);
	expect(prerenderedNames).toEqual(EXPECTED_NAMES);
	for (const { icon } of EXPECTED_CARDS) {
		expect(html).toContain(`lucide-${icon}`);
	}

	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto(AGENTS_URL);
	await expect(cards(page)).toHaveCount(4);
	await expect(cardNames(page)).toHaveText(EXPECTED_NAMES);
	for (const [index, { icon }] of EXPECTED_CARDS.entries()) {
		await expect(
			cards(page).nth(index).locator(`svg.lucide-${icon}`),
		).toBeVisible();
	}
	await context.close();
});

test('The browser tab is titled “Agents · Moukie” and the page declares `lang="fr"`.', async ({
	page,
}) => {
	await expect(page).toHaveTitle("Agents · Moukie");
	await expect(page.locator("html")).toHaveAttribute("lang", "fr");
});

test("On desktop, the rendering matches the mockup, except for the card texts, which come from the plugin.", async ({
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
	expect(await countGridColumns(page)).toBe(3);
	const [firstCardBox, fourthCardBox] = await Promise.all([
		cards(page).nth(0).boundingBox(),
		cards(page).nth(3).boundingBox(),
	]);
	expect(fourthCardBox?.x).toBe(firstCardBox?.x);
	expect(fourthCardBox?.y).toBeGreaterThan(
		(firstCardBox?.y ?? 0) + (firstCardBox?.height ?? 0),
	);

	const card = cards(page).first();
	await expect(card).toHaveCSS("background-color", "rgb(255, 255, 255)");
	await expect(card).toHaveCSS("border-top-width", "2px");
	await expect(card).toHaveCSS("border-top-style", "dashed");
	await expect(card).toHaveCSS("border-top-color", "rgb(27, 25, 25)");
	await expect(card).toHaveCSS("border-top-left-radius", "8px");
	await expect(card).toHaveCSS("row-gap", "32px");

	await expect(card.getByRole("heading", { level: 2 })).toHaveCSS(
		"font-size",
		"24px",
	);
	await expect(card.getByRole("heading", { level: 2 })).toHaveCSS(
		"font-weight",
		"700",
	);
	const badge = card.getByText("Lane", { exact: true });
	await expect(badge).toHaveCSS("font-size", "14px");
	await expect(badge).toHaveCSS("font-weight", "500");
	await expect(badge).toHaveCSS("background-color", "rgb(27, 25, 25)");
	await expect(badge).toHaveCSS("color", "rgb(255, 255, 255)");
	await expect(
		cards(page).nth(3).getByText("Review", { exact: true }),
	).toHaveCSS("background-color", "rgb(27, 25, 25)");
	await expect(card.getByText(EXPECTED_CARDS[0].summary)).toHaveCSS(
		"font-size",
		"20px",
	);
	await expect(card.getByText(EXPECTED_CARDS[0].produces)).toHaveCSS(
		"font-size",
		"16px",
	);

	const activeEntry = sidebar(page).getByRole("link", { name: "Agents" });
	await expect(activeEntry).toHaveCSS("background-color", "rgb(23, 23, 23)");
	await expect(activeEntry.getByText("Agents")).toHaveCSS("font-size", "20px");
	await expect(activeEntry.getByText("Agents")).toHaveCSS("font-weight", "700");

	await page.screenshot({
		path: resolve(import.meta.dirname, "../test-results/agents-desktop.png"),
		fullPage: true,
	});
});

test("hydrates the prerendered Agents page without calling a server function or logging an error", async ({
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

	await page.goto(AGENTS_URL);
	await page.waitForLoadState("networkidle");
	await sidebar(page).getByRole("link", { name: "Skills" }).hover();
	await page.waitForLoadState("networkidle");

	expect(serverFunctionRequests).toEqual([]);
	expect(errors).toEqual([]);
	await context.close();
});
