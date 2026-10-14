import { describe, expect, it } from "vitest";
import { isLucideIconName } from "./lucide-icon";

describe("isLucideIconName", () => {
	it("accepts a kebab-case Lucide icon name", () => {
		expect(isLucideIconName("clef-treble")).toBe(true);
	});

	it("rejects a component name and an unknown name", () => {
		expect(isLucideIconName("Rocket")).toBe(false);
		expect(isLucideIconName("not-a-lucide-icon")).toBe(false);
	});
});
