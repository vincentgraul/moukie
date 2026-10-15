import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, type Page, test } from "@playwright/test";

const ENGLISH_SKILLS_URL = "en/skills/";
const ENGLISH_AGENTS_URL = "en/agents/";

type ExpectedCard = {
	readonly name: string;
	readonly icon: string;
	readonly badge: string;
	readonly summary: string;
	readonly produces?: string;
};

const ENGLISH_SKILL_CARDS: readonly ExpectedCard[] = [
	{
		name: "setup",
		icon: "rocket",
		badge: "Project",
		summary: "Runs the kickoff interview and sets up the whole workflow.",
		produces: "Creates project/ and CLAUDE.md",
	},
	{
		name: "product",
		icon: "target",
		badge: "Project",
		summary: "Challenges your product, with research into what already exists.",
		produces: "Creates product.md and market.md",
	},
	{
		name: "stack",
		icon: "layers",
		badge: "Project",
		summary:
			"Checks the stack against your product, verifying versions and licenses.",
		produces: "Creates stack.md",
	},
	{
		name: "architecture",
		icon: "building",
		badge: "Project",
		summary: "Apps, repository, front and back split, modules, contract.",
		produces: "Creates architecture.md",
	},
	{
		name: "scaffold",
		icon: "hammer",
		badge: "Project",
		summary: "Generates the missing apps, without touching existing code.",
	},
	{
		name: "spec",
		icon: "file-text",
		badge: "Feature",
		summary: "Scopes a feature and splits it into stories.",
		produces: "Creates project/specs/",
	},
	{
		name: "orchestrator",
		icon: "clef-treble",
		badge: "Story",
		summary: "One lane per app, in parallel, all the way to the PR.",
		produces: "Calls contract and pr",
	},
	{
		name: "contract",
		icon: "key-round",
		badge: "Story",
		summary: "Freezes the interface between apps before parallel work starts.",
	},
	{
		name: "pr",
		icon: "git-branch",
		badge: "Story",
		summary: "Commits, pushes and opens the PR. Never merges.",
	},
];

const ENGLISH_AGENT_CARDS: readonly ExpectedCard[] = [
	{
		name: "backend",
		icon: "server",
		badge: "Lane",
		summary: "Codes the server side of a story, against the frozen contract.",
		produces: "Commits the server code and its tests",
	},
	{
		name: "front-web",
		icon: "panel-top",
		badge: "Lane",
		summary: "Codes the web interface of a story with the design system.",
		produces: "Commits the web interface and its tests",
	},
	{
		name: "front-mobile",
		icon: "smartphone",
		badge: "Lane",
		summary: "Codes the mobile interface of a story, one instance per app.",
		produces: "Commits the mobile interface and its tests",
	},
	{
		name: "reviewer",
		icon: "eye",
		badge: "Review",
		summary: "Reviews the whole story before the PR, without fixing anything.",
		produces: "Reports findings in three severity levels",
	},
];

const ENGLISH_PAGES = [
	{
		url: ENGLISH_SKILLS_URL,
		frenchUrl: "fr/skills/",
		builtPath: "en/skills/index.html",
		title: "Skills",
		documentTitle: "Skills · Moukie",
		introduction:
			"A skill is one of Moukie's abilities. You don't need to call them by name: they trigger on what you say. You can also invoke them directly, with /moukie:<skill>.",
		activeEntry: "Skills",
		cards: ENGLISH_SKILL_CARDS,
	},
	{
		url: ENGLISH_AGENTS_URL,
		frenchUrl: "fr/agents/",
		builtPath: "en/agents/index.html",
		title: "Agents",
		documentTitle: "Agents · Moukie",
		introduction:
			"Agents are the ones who write the code. You never call them: the orchestrator launches them for each story, one per app involved, in parallel, each in its own copy of the repository. They follow your stack, your architecture and the contract between apps, write their tests first, and never merge anything.",
		activeEntry: "Agents",
		cards: ENGLISH_AGENT_CARDS,
	},
] as const;

const NAVIGATION_ENTRIES = [
	"Getting started",
	"Skills",
	"Agents",
	"Workflow map",
];

function readMessages(locale: string): Record<string, string> {
	return JSON.parse(
		readFileSync(
			resolve(import.meta.dirname, `../messages/${locale}.json`),
			"utf8",
		),
	);
}

function readBuiltPage(path: string) {
	return readFileSync(
		resolve(import.meta.dirname, "../dist/client", path),
		"utf8",
	);
}

function frenchOnlyInterfaceStrings() {
	const frenchMessages = readMessages("fr");
	const englishMessages = readMessages("en");
	return Object.entries(frenchMessages)
		.filter(([key, text]) => key !== "$schema" && text !== englishMessages[key])
		.map(([, text]) => text);
}

function cards(page: Page) {
	return page.getByRole("main").getByRole("listitem");
}

function cardNames(page: Page) {
	return page.getByRole("main").getByRole("heading", { level: 2 });
}

function sidebar(page: Page) {
	return page.getByRole("navigation", { name: "Main navigation" });
}

async function readPageStrings(page: Page) {
	return page.evaluate(() => {
		const body = document.body.cloneNode(true) as HTMLElement;
		for (const script of body.querySelectorAll("script, style")) {
			script.remove();
		}
		const attributeValues = [...document.querySelectorAll("*")].flatMap(
			(element) =>
				["aria-label", "alt", "title", "placeholder"]
					.map((name) => element.getAttribute(name))
					.filter((value): value is string => value !== null),
		);
		return [document.title, body.textContent ?? "", ...attributeValues].join(
			"\n",
		);
	});
}

async function readFrenchCardTexts(page: Page) {
	return cards(page).evaluateAll((items) =>
		items.flatMap((item) => {
			const name = item.querySelector("h2")?.textContent?.trim();
			return [...item.querySelectorAll("*")]
				.filter((element) => element.children.length === 0)
				.map((element) => element.textContent?.trim() ?? "")
				.filter(
					(text) =>
						text !== "" &&
						text !== name &&
						!["Feature", "Story", "Lane", "Review"].includes(text),
				);
		}),
	);
}

test("`/moukie/en/skills` et `/moukie/en/agents` affichent en anglais les titres, les introductions, les entrées de la barre latérale, les libellés de badge (Project, Feature, Story, Lane, Review), les résumés et ce que produit chaque élément.", async ({
	page,
}) => {
	for (const expectedPage of ENGLISH_PAGES) {
		await page.goto(expectedPage.url);
		await expect(page).toHaveURL(new RegExp(`/moukie/${expectedPage.url}$`));

		const title = page.getByRole("heading", { level: 1 });
		await expect(title).toHaveText(expectedPage.title);
		await expect(title.locator("xpath=following-sibling::*[1]")).toHaveText(
			expectedPage.introduction,
		);

		await expect(sidebar(page).getByRole("listitem")).toHaveText(
			NAVIGATION_ENTRIES,
		);
		const activeEntry = sidebar(page).getByRole("link", {
			name: expectedPage.activeEntry,
		});
		await expect(activeEntry).toHaveAttribute("aria-current", "page");
		for (const name of ["Skills", "Agents"]) {
			await expect(sidebar(page).getByRole("link", { name })).toHaveAttribute(
				"href",
				`/moukie/en/${name.toLowerCase()}/`,
			);
		}

		await expect(cards(page)).toHaveCount(expectedPage.cards.length);
		await expect(cardNames(page)).toHaveText(
			expectedPage.cards.map((card) => card.name),
		);
		for (const [index, expected] of expectedPage.cards.entries()) {
			const card = cards(page).nth(index);
			await expect(card.locator(`svg.lucide-${expected.icon}`)).toBeVisible();
			await expect(
				card.getByText(expected.badge, { exact: true }),
			).toBeVisible();
			await expect(
				card.getByText(expected.summary, { exact: true }),
			).toBeVisible();
			const producesLine = card.locator("svg.lucide-arrow-big-right");
			if (expected.produces) {
				await expect(
					producesLine.locator("xpath=following-sibling::*[1]"),
				).toHaveText(expected.produces);
			} else {
				await expect(producesLine).toHaveCount(0);
			}
		}
	}
});

test("shows every English badge label on the English pages", async ({
	page,
}) => {
	const badges = new Set<string>();
	for (const { url } of ENGLISH_PAGES) {
		await page.goto(url);
		for (const label of ["Project", "Feature", "Story", "Lane", "Review"]) {
			if ((await cards(page).getByText(label, { exact: true }).count()) > 0) {
				badges.add(label);
			}
		}
	}
	expect([...badges].sort()).toEqual(
		["Feature", "Lane", "Project", "Review", "Story"].sort(),
	);
});

test('Les pages anglaises déclarent `lang="en"`, et leurs onglets s\'intitulent « Skills · Moukie » et « Agents · Moukie ».', async ({
	page,
}) => {
	for (const { url, documentTitle } of ENGLISH_PAGES) {
		await page.goto(url);
		await expect(page).toHaveTitle(documentTitle);
		await expect(page.locator("html")).toHaveAttribute("lang", "en");
	}
});

test("Un test end-to-end vérifie qu'aucune chaîne d'interface française ne reste sur les pages anglaises.", async ({
	page,
}) => {
	const frenchStrings = frenchOnlyInterfaceStrings();
	expect(frenchStrings).toContain("Langue");
	expect(frenchStrings).toContain("Projet");

	for (const { url, frenchUrl } of ENGLISH_PAGES) {
		await page.goto(frenchUrl);
		const frenchCardTexts = await readFrenchCardTexts(page);
		expect(frenchCardTexts.length, frenchUrl).toBeGreaterThan(0);

		await page.goto(url);
		await page.setViewportSize({ width: 500, height: 900 });
		await page.getByRole("button", { name: "Open the menu" }).click();
		await expect(
			page.getByRole("button", { name: "Close the menu" }),
		).toBeVisible();
		const englishStrings = await readPageStrings(page);

		for (const text of [...frenchStrings, ...frenchCardTexts]) {
			expect(englishStrings, `${url} : ${text}`).not.toContain(text);
		}
		await page.setViewportSize({ width: 1280, height: 900 });
	}

	const homePage = readBuiltPage("en/index.html");
	for (const text of frenchStrings) {
		expect(homePage, `en/ : ${text}`).not.toContain(text);
	}
});

test("Les pages anglaises sont pré-rendues, comme les pages françaises.", async ({
	browser,
}) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	for (const expectedPage of ENGLISH_PAGES) {
		const html = readBuiltPage(expectedPage.builtPath);
		expect(html).toContain('<html lang="en">');
		expect(html).toContain(`<title>${expectedPage.documentTitle}</title>`);
		const prerenderedNames = [...html.matchAll(/<h2[^>]*>([^<]+)<\/h2>/g)].map(
			([, name]) => name,
		);
		expect(prerenderedNames).toEqual(
			expectedPage.cards.map((card) => card.name),
		);
		for (const card of expectedPage.cards) {
			expect(html).toContain(card.summary.replaceAll("'", "&#x27;"));
		}

		await page.goto(expectedPage.url);
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(
			expectedPage.title,
		);
		await expect(cardNames(page)).toHaveText(
			expectedPage.cards.map((card) => card.name),
		);
		for (const [index, card] of expectedPage.cards.entries()) {
			await expect(
				cards(page).nth(index).getByText(card.summary, { exact: true }),
			).toBeVisible();
		}
	}
	await context.close();
});

test("hydrates the prerendered English pages without calling a server function or logging an error", async ({
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

	for (const { url } of ENGLISH_PAGES) {
		await page.goto(url);
		await page.waitForLoadState("networkidle");
	}

	expect(serverFunctionRequests).toEqual([]);
	expect(errors).toEqual([]);
});
