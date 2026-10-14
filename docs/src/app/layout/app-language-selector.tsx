import { LanguageSelector as EmpreintLanguageSelector } from "@empreint/ui";
import { type Locale, PUBLISHED_LOCALES, useLocale } from "@/shared/i18n";
import styles from "./app-language-selector.module.css";
import frenchFlag from "./french-flag.png";

const LANGUAGE_FLAGS: Readonly<Partial<Record<Locale, string>>> = {
	fr: frenchFlag,
};

export function AppLanguageSelector() {
	const locale = useLocale();

	return (
		<EmpreintLanguageSelector
			className={styles.appLanguageSelector}
			value={locale}
			languages={PUBLISHED_LOCALES.map((publishedLocale) => ({
				value: publishedLocale,
				icon: <img src={LANGUAGE_FLAGS[publishedLocale]} alt="" />,
			}))}
		/>
	);
}
