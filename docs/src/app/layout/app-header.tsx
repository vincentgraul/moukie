import {
	IconButton as EmpreintIconButton,
	Separator as EmpreintSeparator,
} from "@empreint/ui";
import { REPOSITORY_URL } from "@/shared/config";
import { m, useLocale } from "@/shared/i18n";
import styles from "./app-header.module.css";
import { AppLanguageSelector } from "./app-language-selector";
import githubMark from "./github-mark.svg";
import { MobileMenu } from "./mobile-menu";

export function AppHeader() {
	const locale = useLocale();

	return (
		<header className={styles.appHeader}>
			<MobileMenu />
			<EmpreintIconButton asChild variant="ghost" size="5">
				<a
					href={REPOSITORY_URL}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={m.header_github({}, { locale })}
				>
					<img src={githubMark} alt="" />
				</a>
			</EmpreintIconButton>
			<EmpreintSeparator
				className={styles.separator}
				orientation="vertical"
				size="3"
			/>
			<AppLanguageSelector />
		</header>
	);
}
