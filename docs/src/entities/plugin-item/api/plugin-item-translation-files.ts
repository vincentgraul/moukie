import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { PluginFile } from "@/shared/api";
import { readPluginFile } from "@/shared/api/index.server";
import { baseLocale } from "@/shared/i18n";
import { hashSourceText } from "@/shared/lib/index.server";
import {
	type PluginItemCard,
	toPluginItemCard,
} from "../model/plugin-item-card";
import type { PluginItemLabel } from "../model/plugin-item-label";
import {
	listExtraFields,
	listMissingFields,
	type PluginItemTranslation,
	parsePluginItemTranslation,
	TRANSLATED_FIELD_SOURCE_KEYS,
	TRANSLATED_FIELDS,
	translatePluginItemCard,
} from "../model/plugin-item-translation";
import type { PluginItemSource } from "./plugin-item-source";

const CONTENT_DIRECTORY = "docs/content";
const TRANSLATION_FILE_EXTENSION = ".json";

function toTranslationDirectory(locale: string, source: PluginItemSource) {
	return `${CONTENT_DIRECTORY}/${locale}/${source.directory}`;
}

function toTranslationPath(
	locale: string,
	source: PluginItemSource,
	name: string,
) {
	return `${toTranslationDirectory(locale, source)}/${name}${TRANSLATION_FILE_EXTENSION}`;
}

export function readPluginItemTranslation(
	pluginRoot: string,
	path: string,
): PluginItemTranslation | undefined {
	const absolutePath = join(pluginRoot, path);
	if (!existsSync(absolutePath)) {
		return undefined;
	}
	let value: unknown;
	try {
		value = JSON.parse(readFileSync(absolutePath, "utf8"));
	} catch (error) {
		throw new Error(
			`${path} : JSON illisible, ${error instanceof Error ? error.message : error}`,
		);
	}
	return parsePluginItemTranslation(path, value);
}

function nameItem(label: PluginItemLabel, card: PluginItemCard) {
	return `${label.definite} « ${card.name} »`;
}

function describeMissingTranslation(
	path: string,
	locale: string,
	label: PluginItemLabel,
	card: PluginItemCard,
) {
	return `${path} : traduction ${locale} absente pour ${nameItem(label, card)}`;
}

function describeMissingFields(
	path: string,
	label: PluginItemLabel,
	card: PluginItemCard,
	translation: PluginItemTranslation,
) {
	return listMissingFields(card, translation).map(
		(field) =>
			`${path} : ${field} manquant, ${nameItem(label, card)} a un ${TRANSLATED_FIELD_SOURCE_KEYS[field]}`,
	);
}

function describeExtraFields(
	path: string,
	label: PluginItemLabel,
	card: PluginItemCard,
	translation: PluginItemTranslation,
) {
	return listExtraFields(card, translation).map(
		(field) =>
			`${path} : ${field} en trop, ${nameItem(label, card)} n'a pas de ${TRANSLATED_FIELD_SOURCE_KEYS[field]}`,
	);
}

function describeStaleFields(
	path: string,
	label: PluginItemLabel,
	card: PluginItemCard,
	translation: PluginItemTranslation,
) {
	return TRANSLATED_FIELDS.flatMap((field) => {
		const sourceText = card[field];
		const translatedText = translation[field];
		if (
			sourceText === undefined ||
			translatedText === undefined ||
			hashSourceText(sourceText) === translatedText.sourceHash
		) {
			return [];
		}
		return [
			`${path} : ${TRANSLATED_FIELD_SOURCE_KEYS[field]} ${label.possessive} « ${card.name} » a changé depuis sa traduction`,
		];
	});
}

export function localizePluginItemCards(
	pluginRoot: string,
	cards: readonly PluginItemCard[],
	locale: string,
	source: PluginItemSource,
): PluginItemCard[] {
	if (locale === baseLocale) {
		return [...cards];
	}
	return cards.map((card) => {
		const path = toTranslationPath(locale, source, card.name);
		const translation = readPluginItemTranslation(pluginRoot, path);
		if (translation === undefined) {
			throw new Error(
				describeMissingTranslation(path, locale, source.label, card),
			);
		}
		const errors = describeMissingFields(path, source.label, card, translation);
		if (errors.length > 0) {
			throw new Error(errors.join("\n"));
		}
		return translatePluginItemCard(card, translation);
	});
}

function listTranslationNames(
	pluginRoot: string,
	locale: string,
	source: PluginItemSource,
) {
	const directory = join(pluginRoot, toTranslationDirectory(locale, source));
	if (!existsSync(directory)) {
		return [];
	}
	return readdirSync(directory, { withFileTypes: true })
		.filter(
			(entry) =>
				entry.isFile() && entry.name.endsWith(TRANSLATION_FILE_EXTENSION),
		)
		.map((entry) => entry.name.slice(0, -TRANSLATION_FILE_EXTENSION.length))
		.sort();
}

function checkCardTranslation(
	pluginRoot: string,
	card: PluginItemCard,
	locale: string,
	source: PluginItemSource,
): string[] {
	const path = toTranslationPath(locale, source, card.name);
	try {
		const translation = readPluginItemTranslation(pluginRoot, path);
		if (translation === undefined) {
			return [describeMissingTranslation(path, locale, source.label, card)];
		}
		return [
			...describeMissingFields(path, source.label, card, translation),
			...describeExtraFields(path, source.label, card, translation),
			...describeStaleFields(path, source.label, card, translation),
		];
	} catch (error) {
		return [error instanceof Error ? error.message : String(error)];
	}
}

export function checkPluginItemTranslations(
	pluginRoot: string,
	source: PluginItemSource,
	locale: string,
): string[] {
	if (!existsSync(join(pluginRoot, source.directory))) {
		return [];
	}
	const errors: string[] = [];
	const translatableNames = new Set<string>();

	for (const filePath of source.listFilePaths(pluginRoot)) {
		let file: PluginFile;
		try {
			file = readPluginFile(pluginRoot, filePath);
		} catch {
			continue;
		}
		let card: PluginItemCard | undefined;
		try {
			card = toPluginItemCard(file, source.label);
		} catch {
			if (typeof file.frontmatter.name === "string") {
				translatableNames.add(file.frontmatter.name);
			}
			continue;
		}
		if (card !== undefined) {
			translatableNames.add(card.name);
			errors.push(...checkCardTranslation(pluginRoot, card, locale, source));
		}
	}

	for (const name of listTranslationNames(pluginRoot, locale, source)) {
		if (!translatableNames.has(name)) {
			errors.push(
				`${toTranslationPath(locale, source, name)} : aucun ${source.label.noun} affiché ne s'appelle « ${name} »`,
			);
		}
	}

	return errors;
}
