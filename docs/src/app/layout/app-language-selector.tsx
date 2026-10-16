import {
	Field as EmpreintField,
	FieldLabel as EmpreintFieldLabel,
	FlagGb as EmpreintFlagGb,
	LanguageSelector as EmpreintLanguageSelector,
} from "@empreint/ui";
import type { CSSProperties, ReactNode } from "react";
import {
	type LanguageSwitchDestination,
	useSwitchLanguage,
} from "@/features/switch-language";
import {
	isPublishedLocale,
	m,
	PUBLISHED_LOCALES,
	type PublishedLocale,
	useLocale,
} from "@/shared/i18n";
import styles from "./app-language-selector.module.css";
import britishFlag from "./british-flag.svg";
import frenchFlag from "./french-flag.png";

type LanguageFlag = {
	readonly icon: ReactNode;
	readonly imageUrl: string;
};

const LANGUAGE_FLAGS: Readonly<Record<PublishedLocale, LanguageFlag>> = {
	fr: { icon: <img src={frenchFlag} alt="" />, imageUrl: frenchFlag },
	en: {
		icon: <EmpreintFlagGb preserveAspectRatio="xMidYMid slice" />,
		imageUrl: britishFlag,
	},
};

export type AppLanguageSelectorProps = {
	readonly destination?: LanguageSwitchDestination;
};

export function AppLanguageSelector({
	destination = "same-page",
}: AppLanguageSelectorProps) {
	const locale = useLocale();
	const switchLanguage = useSwitchLanguage(destination);
	const currentFlagStyle = {
		"--app-language-current-flag": `url("${LANGUAGE_FLAGS[locale].imageUrl}")`,
	} as CSSProperties;

	return (
		<EmpreintField className={styles.appLanguageSelector}>
			<EmpreintFieldLabel className={styles.label}>
				{m.header_language({}, { locale })}
			</EmpreintFieldLabel>
			<EmpreintLanguageSelector
				style={currentFlagStyle}
				value={locale}
				onChange={({ value }) => {
					if (value !== locale && isPublishedLocale(value)) {
						switchLanguage(value);
					}
				}}
				languages={PUBLISHED_LOCALES.map((publishedLocale) => ({
					value: publishedLocale,
					icon: LANGUAGE_FLAGS[publishedLocale].icon,
				}))}
			/>
		</EmpreintField>
	);
}
