import {
	Field as EmpreintField,
	FieldLabel as EmpreintFieldLabel,
	LanguageSelector as EmpreintLanguageSelector,
} from "@empreint/ui";
import type { CSSProperties } from "react";
import { type Locale, m, PUBLISHED_LOCALES, useLocale } from "@/shared/i18n";
import styles from "./app-language-selector.module.css";
import frenchFlag from "./french-flag.png";

const LANGUAGE_FLAGS: Readonly<Partial<Record<Locale, string>>> = {
	fr: frenchFlag,
};

export function AppLanguageSelector() {
	const locale = useLocale();
	const currentFlagStyle = {
		"--app-language-current-flag": `url("${LANGUAGE_FLAGS[locale]}")`,
	} as CSSProperties;

	return (
		<EmpreintField className={styles.appLanguageSelector}>
			<EmpreintFieldLabel className={styles.label}>
				{m.header_language({}, { locale })}
			</EmpreintFieldLabel>
			<EmpreintLanguageSelector
				style={currentFlagStyle}
				value={locale}
				languages={PUBLISHED_LOCALES.map((publishedLocale) => ({
					value: publishedLocale,
					icon: <img src={LANGUAGE_FLAGS[publishedLocale]} alt="" />,
				}))}
			/>
		</EmpreintField>
	);
}
