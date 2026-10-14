import { describe, expect, it } from "vitest";
import { loadLucideIconShape, parseIconShape } from "./lucide-icon-shape";

describe("loadLucideIconShape", () => {
	it("returns the Lucide drawing of an icon as plain serializable elements", async () => {
		const shape = await loadLucideIconShape("target");

		expect(shape).toEqual([
			["circle", { cx: "12", cy: "12", r: "10" }],
			["circle", { cx: "12", cy: "12", r: "6" }],
			["circle", { cx: "12", cy: "12", r: "2" }],
		]);
	});

	it("keeps the attributes Lucide sets on an element", async () => {
		const shape = await loadLucideIconShape("key-round");

		expect(shape).toContainEqual([
			"circle",
			{ cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor" },
		]);
	});
});

describe("parseIconShape", () => {
	it("reads the elements of an svg, in React attribute names and decoded", () => {
		const shape = parseIconShape(
			'<svg class="lucide"><path d="M1 1" stroke-width="3"></path><text data-x="a &amp; b"></text></svg>',
		);

		expect(shape).toEqual([
			["path", { d: "M1 1", strokeWidth: "3" }],
			["text", { dataX: "a & b" }],
		]);
	});
});
