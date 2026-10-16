import { expect, type Page, test } from "@playwright/test";

const PAGES = [
	{ locale: "fr", url: "fr/skills/", languageLabel: "Langue" },
	{ locale: "fr", url: "fr/agents/", languageLabel: "Langue" },
	{ locale: "en", url: "en/skills/", languageLabel: "Language" },
	{ locale: "en", url: "en/agents/", languageLabel: "Language" },
] as const;

const FLAG_SIGNATURES = {
	fr: /^url\("data:image\/png;base64,/,
	en: /^url\("data:image\/svg\+xml,.*%23012169/,
} as const;

function languageTrigger(page: Page) {
	return page.locator("header button[aria-labelledby]");
}

function languageOptions(page: Page) {
	return page.locator("header li button");
}

function languageOption(page: Page, locale: string) {
	return languageOptions(page).filter({
		has: page.getByRole("img", { name: locale, exact: true }),
	});
}

async function readTriggerBackground(page: Page) {
	return languageTrigger(page)
		.locator("span")
		.first()
		.evaluate((span) => getComputedStyle(span).backgroundImage);
}

test("The language selector trigger shows the flag of the current language. The selector offers French and English.", async ({
	page,
	browser,
}) => {
	for (const { locale, url, languageLabel } of PAGES) {
		await page.goto(url);
		const trigger = page.getByRole("button", {
			name: new RegExp(`^${languageLabel}`),
		});
		await expect(trigger).toBeVisible();
		const currentFlag = trigger.getByRole("img", { name: locale, exact: true });
		await expect(currentFlag).toBeVisible();
		await expect(trigger.getByRole("img")).toHaveCount(1);
		const box = await currentFlag.boundingBox();
		expect(box?.width, url).toBeGreaterThan(0);
		expect(box?.height, url).toBeGreaterThan(0);

		await trigger.click();
		await expect(languageOptions(page)).toHaveCount(2);
		for (const optionLocale of ["fr", "en"]) {
			await expect(languageOption(page, optionLocale)).toBeVisible();
		}
		await expect(
			page.locator("header li[data-selected='true']").getByRole("img"),
		).toHaveAccessibleName(locale);
	}

	const context = await browser.newContext({ javaScriptEnabled: false });
	const staticPage = await context.newPage();
	for (const { locale, url } of PAGES) {
		await staticPage.goto(url);
		await expect(
			languageTrigger(staticPage).locator("span").first(),
		).toBeEmpty();
		expect(await readTriggerBackground(staticPage), url).toMatch(
			FLAG_SIGNATURES[locale],
		);
		expect(
			await staticPage
				.locator("header li [role='img']")
				.evaluateAll((flags) =>
					flags.map((flag) => flag.getAttribute("aria-label")),
				),
		).toEqual(["fr", "en"]);
	}
	await context.close();
});

test("Choosing the other language leads to the same page in that language: from `/moukie/fr/agents` to `/moukie/en/agents`, and back.", async ({
	page,
}) => {
	const switches = [
		{
			from: "fr/agents/",
			to: "en",
			expected: "/moukie/en/agents/",
			title: "Agents",
		},
		{
			from: "en/agents/",
			to: "fr",
			expected: "/moukie/fr/agents/",
			title: "Agents",
		},
		{
			from: "fr/skills/",
			to: "en",
			expected: "/moukie/en/skills/",
			title: "Skills",
		},
		{
			from: "en/skills/",
			to: "fr",
			expected: "/moukie/fr/skills/",
			title: "Skills",
		},
	];
	for (const { from, to, expected, title } of switches) {
		await page.goto(from);
		await page.waitForLoadState("networkidle");
		await languageTrigger(page).click();
		await languageOption(page, to).click();

		await expect(page).toHaveURL(new RegExp(`${expected}$`));
		await expect(page.locator("html")).toHaveAttribute("lang", to);
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
		await expect(
			languageTrigger(page).getByRole("img", { name: to, exact: true }),
		).toBeVisible();
	}
});

test("keeps the current page when the current language is chosen again", async ({
	page,
}) => {
	await page.goto("en/agents/");
	await page.waitForLoadState("networkidle");
	await languageTrigger(page).click();
	await languageOption(page, "en").click();

	await expect(page).toHaveURL(/\/moukie\/en\/agents\/$/);
	await expect(languageOption(page, "fr")).toBeHidden();
});
