import { describe, expect, it } from "vitest";
import { toLanguageSwitchPath } from "./language-switch-path";

describe("toLanguageSwitchPath", () => {
	it("leads to the same page in the chosen language", () => {
		expect(toLanguageSwitchPath("/fr/agents/", "en")).toBe("/en/agents/");
		expect(toLanguageSwitchPath("/en/agents/", "fr")).toBe("/fr/agents/");
		expect(toLanguageSwitchPath("/fr/skills/", "en")).toBe("/en/skills/");
		expect(toLanguageSwitchPath("/en/skills", "fr")).toBe("/fr/skills/");
	});

	it("finds the page after the base path of the site", () => {
		expect(toLanguageSwitchPath("/fr/agents/", "en")).toBe("/en/agents/");
	});

	it("leads to the home of the chosen language from a path without a known page", () => {
		expect(toLanguageSwitchPath("/fr/", "en")).toBe("/en/");
		expect(toLanguageSwitchPath("/fr/workflow-map/", "en")).toBe("/en/");
		expect(toLanguageSwitchPath("/", "en")).toBe("/en/");
	});

	it("leads to the home of the chosen language whatever the current page, when asked for the home", () => {
		expect(toLanguageSwitchPath("/fr/agents/", "en", "home")).toBe("/en/");
		expect(toLanguageSwitchPath("/en/skills/", "fr", "home")).toBe("/fr/");
		expect(toLanguageSwitchPath("/zzz/", "en", "home")).toBe("/en/");
	});
});
