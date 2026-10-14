import { describe, expect, it } from "vitest";
import { isLucideIconName, loadLucideIconShape } from "./lucide-icon";

describe("isLucideIconName", () => {
	it("accepts a kebab-case Lucide icon name", () => {
		expect(isLucideIconName("clef-treble")).toBe(true);
	});

	it("rejects a component name and an unknown name", () => {
		expect(isLucideIconName("Rocket")).toBe(false);
		expect(isLucideIconName("not-a-lucide-icon")).toBe(false);
	});
});

describe("loadLucideIconShape", () => {
	it("returns the Lucide drawing of an icon as plain serializable elements", async () => {
		const shape = await loadLucideIconShape("target");

		expect(shape).toEqual([
			["circle", { cx: "12", cy: "12", r: "10" }],
			["circle", { cx: "12", cy: "12", r: "6" }],
			["circle", { cx: "12", cy: "12", r: "2" }],
		]);
	});
});
