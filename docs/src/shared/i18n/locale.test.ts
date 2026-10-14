import { describe, expect, it } from "vitest";
import { PUBLISHED_LOCALES, parsePublishedLocale } from "./locale";

describe("published locales", () => {
	it("publishes the site in French and in English", () => {
		expect(PUBLISHED_LOCALES).toEqual(["fr", "en"]);
	});

	it("accepts a published locale and rejects any other", () => {
		expect(parsePublishedLocale("en")).toBe("en");
		expect(() => parsePublishedLocale("de")).toThrow(/« de » non publiée/);
	});
});
