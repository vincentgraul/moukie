import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, type Page, test } from "@playwright/test";

const FRENCH_SUBTITLE =
	"Seul, de la maquette Figma à la PR : Moukie code ton front et ton back en parallèle contre un contrat partagé.";
const ENGLISH_SUBTITLE =
	"Solo, from Figma mockup to PR: Moukie codes your front end and back end in parallel against a shared contract.";
const REPOSITORY_URL = "https://github.com/vincentgraul/moukie";

function expectWithin(
	actual: number | undefined,
	expected: number,
	tolerance = 2,
) {
	expect(actual).toBeGreaterThanOrEqual(expected - tolerance);
	expect(actual).toBeLessThanOrEqual(expected + tolerance);
}

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

test("`/moukie/fr/` affiche l'en-tête commun (icône GitHub, séparateur, sélecteur de langue), sans barre latérale, puis le logo, le titre « Moukie », le sous-titre « Seul, de la maquette Figma à la PR : Moukie code ton front et ton back en parallèle contre un contrat partagé. » et le bouton « Get started ».", async ({
	page,
}) => {
	await page.goto("fr/");

	await expect(page).toHaveURL(/\/moukie\/fr\/$/);
	await expect(
		page.getByRole("navigation", { name: "Navigation principale" }),
	).toHaveCount(0);
	await expect(
		page.getByRole("button", { name: "Ouvrir le menu" }),
	).toBeHidden();

	const header = pageHeader(page, "Moukie sur GitHub");
	const githubLink = header.getByRole("link", { name: "Moukie sur GitHub" });
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

	const logo = page.getByRole("main").locator("img").first();
	await expect(logo).toBeVisible();
	expect(
		await logo.evaluate((image: HTMLImageElement) => image.naturalWidth),
	).toBeGreaterThan(0);

	const title = page.getByRole("heading", { level: 1 });
	await expect(title).toHaveText("Moukie");
	await expect(title.locator("xpath=following-sibling::*[1]")).toHaveText(
		FRENCH_SUBTITLE,
	);
	await expect(
		page.getByRole("main").getByRole("link", { name: "Get started" }),
	).toBeVisible();
});

test("`/moukie/en/` affiche la même page avec le sous-titre « Solo, from Figma mockup to PR: Moukie codes your front end and back end in parallel against a shared contract. » et le bouton « Get started ».", async ({
	page,
}) => {
	await page.goto("en/");

	await expect(page).toHaveURL(/\/moukie\/en\/$/);
	await expect(page.locator("html")).toHaveAttribute("lang", "en");
	await expect(
		page.getByRole("navigation", { name: "Main navigation" }),
	).toHaveCount(0);
	await expect(
		page.getByRole("link", { name: "Moukie on GitHub" }),
	).toBeVisible();
	await expect(page.getByRole("main").locator("img").first()).toBeVisible();

	const title = page.getByRole("heading", { level: 1 });
	await expect(title).toHaveText("Moukie");
	await expect(title.locator("xpath=following-sibling::*[1]")).toHaveText(
		ENGLISH_SUBTITLE,
	);
	await expect(
		page.getByRole("main").getByRole("link", { name: "Get started" }),
	).toBeVisible();
});

test("Le bouton « Get started » est un lien vers Getting started dans la langue courante (`/moukie/fr/getting-started/` ou `/moukie/en/getting-started/`).", async ({
	page,
}) => {
	for (const locale of ["fr", "en"]) {
		await page.goto(`${locale}/`);
		const button = page.getByRole("link", { name: "Get started" });
		await expect(button).toHaveAttribute(
			"href",
			`/moukie/${locale}/getting-started/`,
		);
		await button.click();
		await expect(page).toHaveURL(
			new RegExp(`/moukie/${locale}/getting-started/$`),
		);
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(
			"Getting started",
		);
	}
});

test("`/moukie/` redirige vers `/moukie/fr/`, et `/moukie/fr/` comme `/moukie/en/` ne redirigent plus vers Skills.", async ({
	page,
	browser,
}) => {
	expect(readBuiltPage("index.html")).toContain(
		'<meta http-equiv="refresh" content="0; url=/moukie/fr/"/>',
	);
	for (const path of ["fr/", "en/"]) {
		expect(readBuiltPage(`${path}index.html`), path).not.toContain(
			'http-equiv="refresh"',
		);
	}

	await page.goto("");
	await expect(page).toHaveURL(/\/moukie\/fr\/$/);
	await expect(page.getByRole("heading", { level: 1 })).toHaveText("Moukie");

	const context = await browser.newContext({ javaScriptEnabled: false });
	const staticPage = await context.newPage();
	await staticPage.goto("");
	await expect(staticPage).toHaveURL(/\/moukie\/fr\/$/);
	await context.close();

	for (const path of ["fr/", "en/"]) {
		await page.goto(path);
		await page.waitForLoadState("networkidle");
		await expect(page).toHaveURL(new RegExp(`/moukie/${path}$`));
	}
});

test("Le sélecteur de langue mène de `/moukie/fr/` à `/moukie/en/`, et inversement.", async ({
	page,
}) => {
	for (const { from, to } of [
		{ from: "fr", to: "en" },
		{ from: "en", to: "fr" },
	]) {
		await page.goto(`${from}/`);
		await page.waitForLoadState("networkidle");
		await page.locator("header button[aria-labelledby]").click();
		await page
			.locator("header li button")
			.filter({ has: page.getByRole("img", { name: to, exact: true }) })
			.click();

		await expect(page).toHaveURL(new RegExp(`/moukie/${to}/$`));
		await expect(page.locator("html")).toHaveAttribute("lang", to);
		await expect(page.getByRole("heading", { level: 1 })).toHaveText("Moukie");
	}
});

test("Dans la barre latérale et le menu mobile des autres pages, le logo et le nom « Moukie » sont un lien vers l'accueil de la langue courante.", async ({
	page,
}) => {
	for (const locale of ["fr", "en"]) {
		const navigationName =
			locale === "fr" ? "Navigation principale" : "Main navigation";
		const menuName = locale === "fr" ? "Ouvrir le menu" : "Open the menu";

		await page.setViewportSize({ width: 1280, height: 900 });
		await page.goto(`${locale}/skills/`);
		const sidebarBrand = page
			.getByRole("navigation", { name: navigationName })
			.getByRole("link", { name: "Moukie" });
		await expect(sidebarBrand).toHaveAttribute("href", `/moukie/${locale}/`);
		await expect(sidebarBrand.locator("img")).toBeVisible();
		await sidebarBrand.click();
		await expect(page).toHaveURL(new RegExp(`/moukie/${locale}/$`));
		await expect(page.getByRole("heading", { level: 1 })).toHaveText("Moukie");

		await page.setViewportSize({ width: 500, height: 900 });
		await page.goto(`${locale}/agents/`);
		await page.getByRole("button", { name: menuName }).click();
		const menuBrand = page
			.getByRole("navigation", { name: navigationName })
			.getByRole("link", { name: "Moukie" });
		await expect(menuBrand).toHaveAttribute("href", `/moukie/${locale}/`);
		await expect(menuBrand.locator("img")).toBeVisible();
		await menuBrand.click();
		await expect(page).toHaveURL(new RegExp(`/moukie/${locale}/$`));
	}
});

test("La page est pré-rendue, déclare la langue de sa page, et son onglet s'intitule « Moukie ». En dessous de 768 px, le contenu tient dans la largeur, sans défilement horizontal.", async ({
	page,
	browser,
}) => {
	for (const locale of ["fr", "en"]) {
		const html = readBuiltPage(`${locale}/index.html`);
		expect(html).toContain(`<html lang="${locale}">`);
		expect(html).toContain("<title>Moukie</title>");
		expect(html).toContain(
			locale === "fr" ? FRENCH_SUBTITLE : ENGLISH_SUBTITLE,
		);

		const context = await browser.newContext({ javaScriptEnabled: false });
		const staticPage = await context.newPage();
		await staticPage.goto(`${locale}/`);
		await expect(staticPage.getByRole("heading", { level: 1 })).toHaveText(
			"Moukie",
		);
		await context.close();

		await page.goto(`${locale}/`);
		await expect(page).toHaveTitle("Moukie");
		await expect(page.locator("html")).toHaveAttribute("lang", locale);

		for (const width of [767, 500, 375, 320]) {
			await page.setViewportSize({ width, height: 800 });
			const overflow = await page.evaluate(
				() =>
					document.documentElement.scrollWidth -
					document.documentElement.clientWidth,
			);
			expect(overflow, `${locale} ${width}px`).toBeLessThanOrEqual(0);
		}
	}
});

test("Sur desktop, le rendu correspond à la maquette : polices, tailles, couleurs, espacements. Seul le sous-titre en diffère.", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1512, height: 982 });
	await page.goto("fr/");
	await page.evaluate(() => document.fonts.ready);

	const logo = page.getByRole("main").locator("img").first();
	const title = page.getByRole("heading", { level: 1 });
	const subtitle = title.locator("xpath=following-sibling::*[1]");
	const button = page.getByRole("link", { name: "Get started" });

	await expect(title).toHaveCSS("font-family", /Geist/);
	await expect(title).toHaveCSS("font-size", "96px");
	await expect(title).toHaveCSS("font-weight", "700");
	await expect(title).toHaveCSS("color", "rgb(255, 203, 240)");
	await expect(title).toHaveCSS("-webkit-text-stroke-color", "rgb(27, 25, 25)");

	await expect(subtitle).toHaveCSS("font-family", /Geist/);
	await expect(subtitle).toHaveCSS("font-weight", "600");
	await expect(subtitle).toHaveCSS("color", "rgb(27, 25, 25)");

	await expect(button).toHaveCSS("font-family", /Geist/);
	await expect(button).toHaveCSS("font-size", "36px");
	await expect(button).toHaveCSS("font-weight", "700");
	await expect(button).toHaveCSS("color", "rgb(255, 255, 255)");
	await expect(button).toHaveCSS("background-color", "rgb(27, 25, 25)");
	await expect(button).toHaveCSS("border-top-left-radius", "6px");
	await expect(button).toHaveCSS("padding", "16px 64px");

	const logoBox = await logo.boundingBox();
	const titleBox = await title.boundingBox();
	const subtitleBox = await subtitle.boundingBox();
	const buttonBox = await button.boundingBox();
	expectWithin(logoBox?.width, 300);
	expectWithin(logoBox?.height, 200);
	expectWithin(logoBox?.y, 128);
	expectWithin((logoBox?.x ?? 0) + (logoBox?.width ?? 0) / 2, 756);
	expectWithin((titleBox?.y ?? 0) - ((logoBox?.y ?? 0) + 200), 64);
	expectWithin(titleBox?.height, 125);
	expectWithin(
		(subtitleBox?.y ?? 0) - ((titleBox?.y ?? 0) + (titleBox?.height ?? 0)),
		0,
	);
	expectWithin(
		(buttonBox?.y ?? 0) - ((subtitleBox?.y ?? 0) + (subtitleBox?.height ?? 0)),
		64,
	);
	expectWithin(buttonBox?.height, 79);
	expectWithin(buttonBox?.width, 331);

	const githubBox = await page
		.getByRole("link", { name: "Moukie sur GitHub" })
		.boundingBox();
	expectWithin(githubBox?.x, 1287);
	expectWithin(githubBox?.y, 32);
	expectWithin(githubBox?.width, 64);
});
