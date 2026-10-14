import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function readMessages(locale: string): Record<string, string> {
	return JSON.parse(
		readFileSync(
			resolve(import.meta.dirname, `../../../messages/${locale}.json`),
			"utf8",
		),
	);
}

describe("interface messages", () => {
	it("translates every French interface string into English", () => {
		const frenchMessages = readMessages("fr");
		const englishMessages = readMessages("en");

		expect(Object.keys(englishMessages).sort()).toEqual(
			Object.keys(frenchMessages).sort(),
		);
		for (const [key, text] of Object.entries(englishMessages)) {
			expect(text, key).not.toBe("");
		}
		expect(englishMessages.header_language).toBe("Language");
		expect(englishMessages.badge_project).toBe("Project");
	});
});
