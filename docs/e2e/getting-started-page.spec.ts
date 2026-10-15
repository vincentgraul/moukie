import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, type Page, test } from "@playwright/test";

const FRENCH_URL = "fr/getting-started/";
const ENGLISH_URL = "en/getting-started/";

const COMMANDS = {
	addMarketplace: "claude plugin marketplace add vincentgraul/moukie",
	installPlugin: "claude plugin install moukie@vincentgraul",
	updateMarketplace: "claude plugin marketplace update vincentgraul",
	updatePlugin: "claude plugin update moukie@vincentgraul",
};

const INSTALLATION_COMMANDS = [COMMANDS.addMarketplace, COMMANDS.installPlugin];
const UPDATE_COMMANDS = [COMMANDS.updateMarketplace, COMMANDS.updatePlugin];

test.use({ permissions: ["clipboard-read", "clipboard-write"] });

function sidebar(page: Page, name: string) {
	return page.getByRole("navigation", { name });
}

function section(page: Page, title: string) {
	return page.getByRole("region", { name: title });
}

async function readClipboard(page: Page) {
	return page.evaluate(() => navigator.clipboard.readText());
}

test("`/moukie/fr/getting-started/` affiche, dans la mise en page commune, le titre « Getting started », puis l'introduction : « Moukie est un plugin Claude Code qui t'accompagne de l'idée à la pull request. Tu cadres, il code chaque app en parallèle contre un contrat partagé, puis il te rapporte la PR : c'est toi qui merges. »", async ({
	page,
}) => {
	await page.goto(FRENCH_URL);

	await expect(page).toHaveURL(/\/moukie\/fr\/getting-started\/$/);
	await expect(sidebar(page, "Navigation principale")).toBeVisible();
	await expect(
		page.getByRole("link", { name: "Moukie sur GitHub" }),
	).toBeVisible();
	const title = page.getByRole("heading", { level: 1 });
	await expect(title).toHaveText("Getting started");
	await expect(title.locator("xpath=following-sibling::*[1]")).toHaveText(
		"Moukie est un plugin Claude Code qui t'accompagne de l'idée à la pull request. Tu cadres, il code chaque app en parallèle contre un contrat partagé, puis il te rapporte la PR : c'est toi qui merges.",
	);
});

test("La section « Prérequis » affiche « Avant de commencer, vérifie que tu as installé : », puis la liste : « Claude Code », « gh (pour GitHub) ou glab (pour GitLab), authentifié », « le MCP Figma, si ton projet a des maquettes ».", async ({
	page,
}) => {
	await page.goto(FRENCH_URL);

	const requirements = section(page, "Prérequis");
	await expect(
		requirements.getByRole("heading", { level: 2, name: "Prérequis" }),
	).toBeVisible();
	await expect(
		requirements.getByText("Avant de commencer, vérifie que tu as installé :", {
			exact: true,
		}),
	).toBeVisible();
	await expect(requirements.getByRole("listitem")).toHaveText([
		"Claude Code",
		"gh (pour GitHub) ou glab (pour GitLab), authentifié",
		"le MCP Figma, si ton projet a des maquettes",
	]);
});

test("La section « Installation » affiche `claude plugin marketplace add vincentgraul/moukie` puis `claude plugin install moukie@vincentgraul`, chacune dans un bloc de code, suivies de « Moukie est chargé à ta prochaine session Claude Code. »", async ({
	page,
}) => {
	await page.goto(FRENCH_URL);

	const installation = section(page, "Installation");
	const blocks = installation.locator("pre code");
	await expect(blocks).toHaveText(INSTALLATION_COMMANDS);
	const lastBlock = installation.locator("pre").last();
	await expect(lastBlock.locator("xpath=following::p[1]")).toHaveText(
		"Moukie est chargé à ta prochaine session Claude Code.",
	);
});

test("La section « Mise à jour » affiche `claude plugin marketplace update vincentgraul` puis `claude plugin update moukie@vincentgraul`.", async ({
	page,
}) => {
	await page.goto(FRENCH_URL);

	const update = section(page, "Mise à jour");
	await expect(update.locator("pre code")).toHaveText(UPDATE_COMMANDS);
});

test("Chaque bloc a un bouton de copie, atteignable au clavier, qui place la commande exacte dans le presse-papiers. L'icône devient une coche pendant 2 secondes, et « Copié » est annoncé aux lecteurs d'écran. Le texte de la commande reste sélectionnable à la main.", async ({
	page,
}) => {
	await page.clock.install();
	await page.goto(FRENCH_URL);

	const copyButtons = page.getByRole("button", { name: "Copier la commande" });
	await expect(copyButtons).toHaveCount(4);

	for (const [index, command] of [
		...INSTALLATION_COMMANDS,
		...UPDATE_COMMANDS,
	].entries()) {
		const button = copyButtons.nth(index);
		await expect(button.locator("svg.lucide-copy")).toBeVisible();
		await button.focus();
		await expect(button).toBeFocused();
		await page.keyboard.press("Enter");

		await expect(button.locator("svg.lucide-check")).toBeVisible();
		expect(await readClipboard(page)).toBe(command);
		await expect(
			button.locator("xpath=following-sibling::*[@role='status']"),
		).toHaveText("Copié");

		await page.clock.fastForward(1900);
		await expect(button.locator("svg.lucide-check")).toBeVisible();
		await page.clock.fastForward(200);
		await expect(button.locator("svg.lucide-copy")).toBeVisible();
		await expect(
			button.locator("xpath=following-sibling::*[@role='status']"),
		).toHaveText("");
	}

	const command = page.locator("pre code").first();
	await expect(command).toHaveCSS("user-select", "auto");
	await command.selectText();
	expect(
		await page.evaluate(() => window.getSelection()?.toString() ?? ""),
	).toBe(COMMANDS.addMarketplace);
});

test("`/moukie/en/getting-started/` affiche la page en anglais : sections « Requirements », « Installation » et « Update », introduction, prérequis et ligne d'après installation traduits, commandes identiques.", async ({
	page,
}) => {
	await page.goto(ENGLISH_URL);

	await expect(page).toHaveURL(/\/moukie\/en\/getting-started\/$/);
	const title = page.getByRole("heading", { level: 1 });
	await expect(title).toHaveText("Getting started");
	await expect(title.locator("xpath=following-sibling::*[1]")).toHaveText(
		"Moukie is a Claude Code plugin that takes you from the idea to the pull request. You scope the work, it codes each app in parallel against a shared contract, then reports back with the PR: you are the one who merges.",
	);
	await expect(page.getByRole("heading", { level: 2 })).toHaveText([
		"Requirements",
		"Installation",
		"Update",
	]);

	const requirements = section(page, "Requirements");
	await expect(
		requirements.getByText("Before you start, make sure you have installed:", {
			exact: true,
		}),
	).toBeVisible();
	await expect(requirements.getByRole("listitem")).toHaveText([
		"Claude Code",
		"gh (for GitHub) or glab (for GitLab), authenticated",
		"the Figma MCP, if your project has mockups",
	]);

	const installation = section(page, "Installation");
	await expect(installation.locator("pre code")).toHaveText(
		INSTALLATION_COMMANDS,
	);
	await expect(
		installation.getByText(
			"Moukie is loaded in your next Claude Code session.",
			{ exact: true },
		),
	).toBeVisible();
	await expect(section(page, "Update").locator("pre code")).toHaveText(
		UPDATE_COMMANDS,
	);

	const copyButton = page.getByRole("button", { name: "Copy the command" });
	await expect(copyButton).toHaveCount(4);
	await copyButton.first().click();
	expect(await readClipboard(page)).toBe(COMMANDS.addMarketplace);
	await expect(page.getByRole("status").first()).toHaveText("Copied");
});

test("L'entrée Getting started de la barre latérale et du menu mobile est active et mène à cette page ; seule Workflow map reste désactivée. La page est pré-rendue, déclare la langue de sa page, et son onglet s'intitule « Getting started · Moukie ».", async ({
	page,
}) => {
	await page.goto("fr/skills/");
	const entry = sidebar(page, "Navigation principale").getByRole("link", {
		name: "Getting started",
	});
	await expect(entry).toHaveAttribute("href", "/moukie/fr/getting-started/");
	await entry.click();
	await expect(page).toHaveURL(/\/moukie\/fr\/getting-started\/$/);

	const desktopEntry = sidebar(page, "Navigation principale").getByRole(
		"link",
		{ name: "Getting started" },
	);
	await expect(desktopEntry).toHaveAttribute("aria-current", "page");
	await expect(
		sidebar(page, "Navigation principale").getByRole("button", {
			name: "Workflow map",
		}),
	).toBeDisabled();
	await expect(page).toHaveTitle("Getting started · Moukie");
	await expect(page.locator("html")).toHaveAttribute("lang", "fr");

	await page.setViewportSize({ width: 500, height: 900 });
	await page.getByRole("button", { name: "Ouvrir le menu" }).click();
	const menu = sidebar(page, "Navigation principale");
	await expect(
		menu.getByRole("link", { name: "Getting started" }),
	).toHaveAttribute("aria-current", "page");
	await expect(
		menu.getByRole("button", { name: "Workflow map" }),
	).toBeDisabled();

	await page.goto(ENGLISH_URL);
	await expect(page).toHaveTitle("Getting started · Moukie");
	await expect(page.locator("html")).toHaveAttribute("lang", "en");

	for (const builtPath of [
		"fr/getting-started/index.html",
		"en/getting-started/index.html",
	]) {
		const html = readFileSync(
			resolve(import.meta.dirname, "../dist/client", builtPath),
			"utf8",
		);
		for (const command of [...INSTALLATION_COMMANDS, ...UPDATE_COMMANDS]) {
			expect(html, builtPath).toContain(command);
		}
	}
});

test("Sur desktop, le rendu correspond à la maquette : polices, tailles, couleurs, séparateurs de section, blocs de code. Seuls les titres de section en français, les prérequis et les commandes en diffèrent.", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1512, height: 1153 });
	await page.goto(FRENCH_URL);

	const title = page.getByRole("heading", { level: 1 });
	await expect(title).toHaveCSS("font-size", "64px");
	await expect(title).toHaveCSS("font-weight", "700");
	await expect(title).toHaveCSS("color", "rgb(255, 203, 240)");
	await expect(title).toHaveCSS("font-family", /Geist/);

	const introduction = title.locator("xpath=following-sibling::*[1]");
	await expect(introduction).toHaveCSS("font-size", "20px");
	await expect(introduction).toHaveCSS("font-weight", "500");
	await expect(introduction).toHaveCSS("color", "rgb(27, 25, 25)");
	const introductionBox = await introduction.boundingBox();
	const titleBox = await title.boundingBox();
	expect(introductionBox?.height).toBeCloseTo(52, -1);
	expect((introductionBox?.y ?? 0) - (titleBox?.y ?? 0)).toBeCloseTo(123, -1);

	for (const name of ["Prérequis", "Installation", "Mise à jour"]) {
		const heading = page.getByRole("heading", { level: 2, name });
		await expect(heading).toHaveCSS("font-size", "32px");
		await expect(heading).toHaveCSS("font-weight", "700");
		await expect(heading).toHaveCSS("color", "rgb(255, 203, 240)");

		const separator = heading.locator("xpath=..");
		await expect(separator).toHaveCSS("column-gap", "12px");
		const lines = await separator.evaluate((element) =>
			["::before", "::after"].map((pseudo) => {
				const style = getComputedStyle(element, pseudo);
				return {
					width: style.width,
					height: style.height,
					color: style.backgroundColor,
				};
			}),
		);
		expect(lines).toEqual([
			{ width: "50px", height: "3px", color: "rgb(27, 25, 25)" },
			{ width: "50px", height: "3px", color: "rgb(27, 25, 25)" },
		]);
	}

	const lead = page.getByText(
		"Avant de commencer, vérifie que tu as installé :",
		{ exact: true },
	);
	await expect(lead).toHaveCSS("font-size", "20px");
	await expect(lead).toHaveCSS("font-weight", "500");
	const items = section(page, "Prérequis").getByRole("listitem");
	for (const index of [0, 1, 2]) {
		await expect(
			items.nth(index).locator("svg.lucide-arrow-big-right"),
		).toHaveCSS("width", "16px");
		await expect(items.nth(index)).toHaveCSS("column-gap", "8px");
	}

	const block = page.locator("pre").first().locator("xpath=..");
	await expect(block).toHaveCSS("background-color", "rgb(38, 38, 38)");
	await expect(block).toHaveCSS("border-top-left-radius", "4px");
	await expect(block).toHaveCSS("padding", "16px");
	await expect(block).toHaveCSS("column-gap", "16px");
	await expect(block.locator("pre")).toHaveCSS("font-size", "16px");
	await expect(block.locator("pre")).toHaveCSS("font-weight", "500");
	await expect(block.locator("pre")).toHaveCSS("color", "rgb(255, 255, 255)");
	await expect(block.locator("pre code")).toHaveCSS("font-family", /Geist/);
	await expect(block.locator("pre code")).toHaveCSS("font-weight", "500");
	await expect(block.locator("svg.lucide-copy")).toHaveCSS("width", "16px");
	await expect(block.locator("svg.lucide-copy")).toHaveCSS(
		"color",
		"rgb(255, 203, 240)",
	);
	const blockBox = await block.boundingBox();
	expect(blockBox?.height).toBeGreaterThanOrEqual(52);
	expect(blockBox?.height).toBeLessThanOrEqual(54);
	const commandBox = await block.locator("pre code").boundingBox();
	expect(blockBox?.width).toBeCloseTo((commandBox?.width ?? 0) + 64, 0);
});
