import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { baseLocale } from "@/shared/i18n";
import { hashSourceText } from "@/shared/lib/index.server";
import { type PluginCard, toPluginCard } from "./plugin-card";
import type { PluginItemSource } from "./plugin-items";
import type { PluginBadge, PluginItemKind } from "./plugin-metadata";
import {
	type PluginTranslation,
	parsePluginTranslation,
	TRANSLATED_FIELD_SOURCE_KEYS,
	TRANSLATED_FIELDS,
	translatePluginCard,
} from "./plugin-translation";
import { readPluginFile } from "./read-plugin-file";

const CONTENT_DIRECTORY = "docs/content";
const TRANSLATION_FILE_EXTENSION = ".json";

type TranslationTarget = {
	readonly locale: string;
	readonly directory: string;
};

function toTranslationDirectory({ locale, directory }: TranslationTarget) {
	return `${CONTENT_DIRECTORY}/${locale}/${directory}`;
}

const VOWEL_START = /^[aeiouh]/i;

function nameItem(noun: string, name: string) {
	return `${VOWEL_START.test(noun) ? `l'${noun}` : `le ${noun}`} « ${name} »`;
}

function nameItemOwner(noun: string, name: string) {
	return `${VOWEL_START.test(noun) ? `de l'${noun}` : `du ${noun}`} « ${name} »`;
}

export function toTranslationPath(target: TranslationTarget, name: string) {
	return `${toTranslationDirectory(target)}/${name}${TRANSLATION_FILE_EXTENSION}`;
}

export function readPluginTranslation(
	pluginRoot: string,
	path: string,
): PluginTranslation | undefined {
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
	return parsePluginTranslation(path, value);
}

export function localizePluginCards<Badge extends PluginBadge>(
	pluginRoot: string,
	cards: readonly PluginCard<Badge>[],
	locale: string,
	source: PluginItemKind<Badge> & { readonly directory: string },
): PluginCard<Badge>[] {
	if (locale === baseLocale) {
		return [...cards];
	}
	const target = { locale, directory: source.directory };
	return cards.map((card) => {
		const path = toTranslationPath(target, card.name);
		const translation = readPluginTranslation(pluginRoot, path);
		if (translation === undefined) {
			throw new Error(
				`${path} : traduction ${locale} absente pour ${nameItem(source.noun, card.name)}`,
			);
		}
		return translatePluginCard(card, translation, path);
	});
}

function checkTranslatedFields<Badge extends PluginBadge>(
	card: PluginCard<Badge>,
	translation: PluginTranslation,
	path: string,
	noun: string,
): string[] {
	return TRANSLATED_FIELDS.flatMap((field) => {
		const sourceText = card[field];
		const translatedText = translation[field];
		const sourceKey = TRANSLATED_FIELD_SOURCE_KEYS[field];
		if (sourceText === undefined && translatedText !== undefined) {
			return [
				`${path} : ${field} en trop, ${nameItem(noun, card.name)} n'a pas de ${sourceKey}`,
			];
		}
		if (sourceText !== undefined && translatedText === undefined) {
			return [
				`${path} : ${field} manquant, ${nameItem(noun, card.name)} a un ${sourceKey}`,
			];
		}
		if (
			sourceText !== undefined &&
			translatedText !== undefined &&
			hashSourceText(sourceText) !== translatedText.sourceHash
		) {
			return [
				`${path} : ${sourceKey} ${nameItemOwner(noun, card.name)} a changé depuis sa traduction`,
			];
		}
		return [];
	});
}

function listTranslationNames(pluginRoot: string, target: TranslationTarget) {
	const directory = join(pluginRoot, toTranslationDirectory(target));
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

export function checkPluginTranslations<Badge extends PluginBadge>(
	pluginRoot: string,
	source: PluginItemSource<Badge>,
	locale: string,
): string[] {
	if (!existsSync(join(pluginRoot, source.directory))) {
		return [];
	}
	const target = { locale, directory: source.directory };
	const errors: string[] = [];
	const translatableNames = new Set<string>();

	for (const filePath of source.listFilePaths(pluginRoot)) {
		let card: PluginCard<Badge> | undefined;
		try {
			const file = readPluginFile(pluginRoot, filePath);
			const name = file.frontmatter.name;
			if (typeof name === "string") {
				translatableNames.add(name);
			}
			card = toPluginCard(file, source);
			if (card === undefined && typeof name === "string") {
				translatableNames.delete(name);
			}
		} catch {
			continue;
		}
		if (card === undefined) {
			continue;
		}
		const path = toTranslationPath(target, card.name);
		try {
			const translation = readPluginTranslation(pluginRoot, path);
			if (translation === undefined) {
				errors.push(
					`${path} : traduction ${locale} absente pour ${nameItem(source.noun, card.name)}`,
				);
				continue;
			}
			errors.push(
				...checkTranslatedFields(card, translation, path, source.noun),
			);
		} catch (error) {
			errors.push(error instanceof Error ? error.message : String(error));
		}
	}

	for (const name of listTranslationNames(pluginRoot, target)) {
		if (!translatableNames.has(name)) {
			errors.push(
				`${toTranslationPath(target, name)} : aucun ${source.noun} affiché ne s'appelle « ${name} »`,
			);
		}
	}

	return errors;
}
