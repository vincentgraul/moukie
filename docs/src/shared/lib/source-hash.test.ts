import { describe, expect, it } from "vitest";
import { hashSourceText } from "./source-hash";

describe("hashSourceText", () => {
	it("fingerprints the French text with its SHA-256, in hexadecimal", () => {
		expect(hashSourceText("Crée stack.md")).toBe(
			"adbd3c3f2fd2418f937e2905c20d49641c57acd4503c0762b7c62141f5ad2f2f",
		);
	});

	it("changes as soon as one character of the French text changes", () => {
		expect(hashSourceText("Crée stack.md.")).toBe(
			"d91994b8cbd306b4892f5479a0041284e39006d004d66b0b6fd608eae798e13a",
		);
		expect(hashSourceText("Crée stack.md.")).not.toBe(
			hashSourceText("Crée stack.md"),
		);
	});
});
