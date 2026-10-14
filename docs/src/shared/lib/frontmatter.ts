export type FrontmatterValue =
	| string
	| readonly string[]
	| Readonly<Record<string, string>>;

export type Frontmatter = Readonly<Record<string, FrontmatterValue>>;

const DELIMITER = "---";
const TOP_LEVEL_ENTRY = /^([\w-]+):(?:[ \t]+(.*))?$/;
const NESTED_ENTRY = /^[ \t]+([\w-]+):(?:[ \t]+(.*))?$/;
const LIST_ITEM = /^[ \t]+-[ \t]+(.*)$/;
const BLOCK_SCALAR_HEADER = /^[>|]/;
const TRAILING_COMMENT = /[ \t]+#.*$/;

type Line = { readonly text: string; readonly number: number };

export function parseFrontmatter(source: string): Frontmatter {
	const lines = extractFrontmatterLines(source);
	const frontmatter: Record<string, FrontmatterValue> = {};
	let index = 0;

	while (index < lines.length) {
		const line = lines[index];
		index += 1;
		if (isBlankOrComment(line.text)) {
			continue;
		}
		const [, key, rawValue = ""] = matchLine(TOP_LEVEL_ENTRY, line);
		const indentedLines: Line[] = [];
		while (index < lines.length && !startsAtColumnZero(lines[index].text)) {
			indentedLines.push(lines[index]);
			index += 1;
		}
		frontmatter[key] = parseValue(line, rawValue, indentedLines);
	}

	return frontmatter;
}

function extractFrontmatterLines(source: string): Line[] {
	const lines = source.replace(/^﻿/, "").split(/\r?\n/);
	if (lines[0]?.trimEnd() !== DELIMITER) {
		throw new Error("frontmatter absent : la première ligne doit être ---");
	}
	const closingIndex = lines.findIndex(
		(text, index) => index > 0 && text.trimEnd() === DELIMITER,
	);
	if (closingIndex === -1) {
		throw new Error("frontmatter non fermé : aucune ligne --- ne le termine");
	}
	return lines
		.slice(1, closingIndex)
		.map((text, index) => ({ text, number: index + 2 }));
}

function parseValue(
	entryLine: Line,
	rawValue: string,
	indentedLines: readonly Line[],
): FrontmatterValue {
	const value = stripTrailingComment(rawValue.trim());
	if (BLOCK_SCALAR_HEADER.test(value)) {
		if (value !== ">" && value !== "|") {
			throw new Error(
				`ligne ${entryLine.number} : seuls les blocs > et | sont pris en charge`,
			);
		}
		return parseBlockScalar(value, indentedLines);
	}
	const contentLines = indentedLines.filter(
		(line) => !isBlankOrComment(line.text),
	);
	if (value !== "") {
		const continuation = contentLines.map((line) => line.text.trim());
		return unquote([value, ...continuation].join(" "));
	}
	if (contentLines.length === 0) {
		return "";
	}
	assertSingleNestingLevel(contentLines);
	if (LIST_ITEM.test(contentLines[0].text)) {
		return contentLines.map((line) =>
			parseScalar(matchLine(LIST_ITEM, line)[1]),
		);
	}
	return Object.fromEntries(
		contentLines.map((line) => {
			const [, key, nestedValue = ""] = matchLine(NESTED_ENTRY, line);
			return [key, parseScalar(nestedValue)];
		}),
	);
}

function assertSingleNestingLevel(contentLines: readonly Line[]) {
	const indentation = indentationOf(contentLines[0].text);
	const deeperLine = contentLines.find(
		(line) => indentationOf(line.text) !== indentation,
	);
	if (deeperLine !== undefined) {
		throw new Error(
			`ligne ${deeperLine.number} : imbrication sur plus d'un niveau non prise en charge`,
		);
	}
}

function parseBlockScalar(style: string, indentedLines: readonly Line[]) {
	const contentLines = trimTrailingBlankLines(
		indentedLines.map((line) => line.text),
	);
	if (contentLines.length === 0) {
		return "";
	}
	const indentation = Math.min(
		...contentLines.filter((text) => text.trim() !== "").map(indentationOf),
	);
	const dedentedLines = contentLines.map((text) =>
		text.slice(indentation).trimEnd(),
	);
	const body =
		style === ">" ? foldLines(dedentedLines) : dedentedLines.join("\n");
	return `${body}\n`;
}

function foldLines(lines: readonly string[]) {
	return lines
		.reduce<string[][]>(
			(paragraphs, text) => {
				if (text === "") {
					paragraphs.push([]);
				} else {
					paragraphs[paragraphs.length - 1].push(text);
				}
				return paragraphs;
			},
			[[]],
		)
		.map((paragraph) => paragraph.join(" "))
		.join("\n");
}

function trimTrailingBlankLines(lines: readonly string[]) {
	let end = lines.length;
	while (end > 0 && lines[end - 1].trim() === "") {
		end -= 1;
	}
	return lines.slice(0, end);
}

function parseScalar(rawValue: string) {
	return unquote(stripTrailingComment(rawValue.trim()));
}

function stripTrailingComment(value: string) {
	const quote = value[0];
	if (quote === '"' || quote === "'") {
		const closingIndex = findClosingQuote(value, quote);
		if (closingIndex !== -1) {
			const rest = value.slice(closingIndex + 1).trim();
			if (rest === "" || rest.startsWith("#")) {
				return value.slice(0, closingIndex + 1);
			}
		}
		return value;
	}
	return value.replace(TRAILING_COMMENT, "");
}

function findClosingQuote(value: string, quote: string) {
	let index = 1;
	while (index < value.length) {
		const character = value[index];
		if (quote === '"' && character === "\\") {
			index += 2;
			continue;
		}
		if (character === quote) {
			if (quote === "'" && value[index + 1] === "'") {
				index += 2;
				continue;
			}
			return index;
		}
		index += 1;
	}
	return -1;
}

function unquote(value: string) {
	if (value.length >= 2 && value.startsWith("'") && value.endsWith("'")) {
		return value.slice(1, -1).replaceAll("''", "'");
	}
	if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
		try {
			return String(JSON.parse(value));
		} catch {
			return value.slice(1, -1);
		}
	}
	return value;
}

function matchLine(pattern: RegExp, line: Line) {
	const match = pattern.exec(line.text);
	if (match === null) {
		throw new Error(`ligne ${line.number} illisible : ${line.text}`);
	}
	return match;
}

function indentationOf(text: string) {
	return text.search(/\S/);
}

function isBlankOrComment(text: string) {
	const trimmed = text.trim();
	return trimmed === "" || trimmed.startsWith("#");
}

function startsAtColumnZero(text: string) {
	return text !== "" && !/^\s/.test(text);
}
