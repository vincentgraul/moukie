export type FrontmatterValue =
	| string
	| readonly string[]
	| Readonly<Record<string, string>>;

export type Frontmatter = Readonly<Record<string, FrontmatterValue>>;

const DELIMITER = "---";
const TOP_LEVEL_ENTRY = /^([\w-]+):(?:[ \t]+(.*))?$/;
const NESTED_ENTRY = /^[ \t]+([\w-]+):(?:[ \t]+(.*))?$/;
const LIST_ITEM = /^[ \t]+-[ \t]+(.*)$/;
const BLOCK_SCALAR_HEADER = /^([>|])([+-]?)$/;

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
		const entry = TOP_LEVEL_ENTRY.exec(line.text);
		if (entry === null) {
			throw new Error(`ligne ${line.number} illisible : ${line.text}`);
		}
		const [, key, rawValue = ""] = entry;
		const indentedLines: Line[] = [];
		while (index < lines.length && !startsAtColumnZero(lines[index].text)) {
			indentedLines.push(lines[index]);
			index += 1;
		}
		frontmatter[key] = parseValue(rawValue.trim(), indentedLines);
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
	rawValue: string,
	indentedLines: readonly Line[],
): FrontmatterValue {
	const blockScalarHeader = BLOCK_SCALAR_HEADER.exec(rawValue);
	if (blockScalarHeader !== null) {
		const [, style, chomping] = blockScalarHeader;
		return parseBlockScalar(style, chomping, indentedLines);
	}
	const contentLines = indentedLines.filter(
		(line) => !isBlankOrComment(line.text),
	);
	if (rawValue !== "") {
		const continuation = contentLines.map((line) => line.text.trim());
		return unquote([rawValue, ...continuation].join(" "));
	}
	if (contentLines.length === 0) {
		return "";
	}
	if (LIST_ITEM.test(contentLines[0].text)) {
		return contentLines.map((line) =>
			unquote(matchLine(LIST_ITEM, line)[1].trim()),
		);
	}
	return Object.fromEntries(
		contentLines.map((line) => {
			const [, key, value = ""] = matchLine(NESTED_ENTRY, line);
			return [key, unquote(value.trim())];
		}),
	);
}

function parseBlockScalar(
	style: string,
	chomping: string,
	indentedLines: readonly Line[],
) {
	const contentLines = trimTrailingBlankLines(
		indentedLines.map((line) => line.text),
	);
	const indentation = Math.min(
		...contentLines
			.filter((text) => text.trim() !== "")
			.map((text) => text.search(/\S/)),
	);
	const dedentedLines = contentLines.map((text) =>
		text.slice(indentation).trimEnd(),
	);
	const body =
		style === ">" ? foldLines(dedentedLines) : dedentedLines.join("\n");
	if (body === "" || chomping === "-") {
		return body;
	}
	if (chomping === "+") {
		const trailingBlankLines = indentedLines.length - contentLines.length;
		return `${body}\n${"\n".repeat(trailingBlankLines)}`;
	}
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

function isBlankOrComment(text: string) {
	const trimmed = text.trim();
	return trimmed === "" || trimmed.startsWith("#");
}

function startsAtColumnZero(text: string) {
	return text !== "" && !/^\s/.test(text);
}
