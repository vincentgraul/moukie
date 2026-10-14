import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "./frontmatter";

describe("parseFrontmatter", () => {
	it("reads plain scalars, including values that contain a colon", () => {
		const source = [
			"---",
			"name: reviewer",
			"description: Relit le code. Lecture seule : il signale, il ne corrige pas.",
			"tools: Read, Grep",
			"---",
			"# reviewer",
		].join("\n");

		expect(parseFrontmatter(source)).toEqual({
			name: "reviewer",
			description:
				"Relit le code. Lecture seule : il signale, il ne corrige pas.",
			tools: "Read, Grep",
		});
	});

	it("unquotes single and double quoted scalars", () => {
		const source = ["---", "single: 'l''agent'", 'double: "1"', "---"].join(
			"\n",
		);

		expect(parseFrontmatter(source)).toEqual({
			single: "l'agent",
			double: "1",
		});
	});

	it("reads a nested map of scalars", () => {
		const source = [
			"---",
			"name: setup",
			"metadata:",
			"  moukie-icon: rocket",
			'  moukie-rank: "1"',
			"  moukie-summary: Mène l'entretien : tout.",
			"model: opus",
			"---",
		].join("\n");

		expect(parseFrontmatter(source)).toEqual({
			name: "setup",
			metadata: {
				"moukie-icon": "rocket",
				"moukie-rank": "1",
				"moukie-summary": "Mène l'entretien : tout.",
			},
			model: "opus",
		});
	});

	it("reads a list of scalars", () => {
		const source = ["---", "tools:", "  - Read", "  - Bash", "---"].join("\n");

		expect(parseFrontmatter(source)).toEqual({ tools: ["Read", "Bash"] });
	});

	it("folds a block scalar introduced by >", () => {
		const source = [
			"---",
			"description: >",
			"  Official skill for applying",
			"  the methodology.",
			"name: fsd",
			"---",
		].join("\n");

		expect(parseFrontmatter(source)).toEqual({
			description: "Official skill for applying the methodology.\n",
			name: "fsd",
		});
	});

	it("keeps the lines of a literal block scalar introduced by |", () => {
		const source = [
			"---",
			"description: |",
			"  first line",
			"  second line",
			"---",
		].join("\n");

		expect(parseFrontmatter(source)).toEqual({
			description: "first line\nsecond line\n",
		});
	});

	it("throws on a block scalar header other than > and |", () => {
		const source = ["---", "description: >-", "  text", "---"].join("\n");

		expect(() => parseFrontmatter(source)).toThrow(/2/);
	});

	it("throws instead of flattening a map nested on more than one level", () => {
		const source = [
			"---",
			"metadata:",
			"  moukie:",
			"    badge: project",
			"---",
		].join("\n");

		expect(() => parseFrontmatter(source)).toThrow(/4/);
	});

	it("strips trailing comments outside quoted values", () => {
		const source = [
			"---",
			"name: setup # the skill",
			"metadata:",
			'  moukie-rank: "1" # first',
			"  moukie-summary: 'Lance # tout' # summary",
			"  moukie-icon: rocket#launch",
			"---",
		].join("\n");

		expect(parseFrontmatter(source)).toEqual({
			name: "setup",
			metadata: {
				"moukie-rank": "1",
				"moukie-summary": "Lance # tout",
				"moukie-icon": "rocket#launch",
			},
		});
	});

	it("joins the continuation lines of a multi-line plain scalar", () => {
		const source = [
			"---",
			"description: first part",
			"  second part",
			"---",
		].join("\n");

		expect(parseFrontmatter(source)).toEqual({
			description: "first part second part",
		});
	});

	it("throws when the source has no frontmatter", () => {
		expect(() => parseFrontmatter("# title\n")).toThrow(/frontmatter/);
	});

	it("throws when the frontmatter is not closed", () => {
		expect(() => parseFrontmatter("---\nname: setup\n")).toThrow(/frontmatter/);
	});

	it("throws with the line number when a line cannot be read", () => {
		expect(() =>
			parseFrontmatter("---\nname: setup\nnot a key\n---\n"),
		).toThrow(/3/);
	});
});
