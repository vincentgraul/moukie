import type { PluginCard } from "./plugin-card";
import type { PluginBadge } from "./plugin-metadata";

export const TRANSLATED_FIELDS = ["summary", "produces"] as const;

export type TranslatedField = (typeof TRANSLATED_FIELDS)[number];

export const TRANSLATED_FIELD_SOURCE_KEYS: Readonly<
	Record<TranslatedField, string>
> = {
	summary: "moukie-summary",
	produces: "moukie-produces",
};

export type TranslatedText = {
	readonly text: string;
	readonly sourceHash: string;
};

export type PluginTranslation = Readonly<
	Partial<Record<TranslatedField, TranslatedText>>
>;

const SOURCE_HASH_PATTERN = /^[0-9a-f]{64}$/;

function isTranslatedField(key: string): key is TranslatedField {
	return (TRANSLATED_FIELDS as readonly string[]).includes(key);
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseTranslatedText(
	path: string,
	field: TranslatedField,
	value: unknown,
): TranslatedText {
	if (
		!isRecord(value) ||
		typeof value.text !== "string" ||
		value.text === "" ||
		typeof value.sourceHash !== "string" ||
		!SOURCE_HASH_PATTERN.test(value.sourceHash)
	) {
		throw new Error(
			`${path} : ${field} doit porter un text non vide et le sourceHash SHA-256 du texte source`,
		);
	}
	return { text: value.text, sourceHash: value.sourceHash };
}

export function parsePluginTranslation(
	path: string,
	value: unknown,
): PluginTranslation {
	if (!isRecord(value)) {
		throw new Error(`${path} : la traduction doit être un objet JSON`);
	}
	const translation: Partial<Record<TranslatedField, TranslatedText>> = {};
	for (const [key, fieldValue] of Object.entries(value)) {
		if (!isTranslatedField(key)) {
			throw new Error(
				`${path} : champ « ${key} » inconnu, attendu l'un de ${TRANSLATED_FIELDS.join(", ")}`,
			);
		}
		translation[key] = parseTranslatedText(path, key, fieldValue);
	}
	return translation;
}

export function translatePluginCard<Badge extends PluginBadge>(
	card: PluginCard<Badge>,
	translation: PluginTranslation,
	path: string,
): PluginCard<Badge> {
	const translateField = (field: TranslatedField) => {
		const translatedText = translation[field];
		if (translatedText === undefined) {
			throw new Error(`${path} : ${field} manquant pour « ${card.name} »`);
		}
		return translatedText.text;
	};
	return {
		...card,
		summary: translateField("summary"),
		...(card.produces === undefined
			? {}
			: { produces: translateField("produces") }),
	};
}
