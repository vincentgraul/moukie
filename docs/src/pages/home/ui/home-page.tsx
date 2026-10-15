import {
	Button as EmpreintButton,
	Text as EmpreintText,
	Title as EmpreintTitle,
} from "@empreint/ui";
import { SITE_NAME, toPagePath, toSiteUrl } from "@/shared/config";
import { m, useLocale } from "@/shared/i18n";
import { MoukieLogo } from "@/shared/ui";
import styles from "./home-page.module.css";

export function HomePage() {
	const locale = useLocale();
	const options = { locale };

	return (
		<div className={styles.homePage}>
			<MoukieLogo className={styles.logo} />
			<div className={styles.heading}>
				<EmpreintTitle as="h1" size="9" weight="bold" className={styles.title}>
					{SITE_NAME}
				</EmpreintTitle>
				<EmpreintText
					as="p"
					size="6"
					weight="semibold"
					className={styles.subtitle}
				>
					{m.home_subtitle({}, options)}
				</EmpreintText>
			</div>
			<EmpreintButton
				asChild
				variant="primary"
				size="5"
				className={styles.button}
			>
				<a href={toSiteUrl(toPagePath(locale, "getting-started"))}>
					{m.home_get_started({}, options)}
				</a>
			</EmpreintButton>
		</div>
	);
}
