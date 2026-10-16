import {
	Button as EmpreintButton,
	Text as EmpreintText,
	Title as EmpreintTitle,
} from "@empreint/ui";
import { toPagePath, toSiteUrl } from "@/shared/config";
import { m, useLocale } from "@/shared/i18n";
import styles from "./not-found-page.module.css";

export function NotFoundPage() {
	const locale = useLocale();
	const options = { locale };

	return (
		<div className={styles.notFoundPage}>
			<EmpreintText as="p" size="6" weight="bold" className={styles.code}>
				404
			</EmpreintText>
			<EmpreintTitle
				as="h1"
				size="4"
				weight="bold"
				align="center"
				className={styles.title}
			>
				{m.not_found_title({}, options)}
			</EmpreintTitle>
			<EmpreintButton asChild variant="primary" size="4">
				<a href={toSiteUrl(toPagePath(locale))}>
					{m.not_found_home({}, options)}
				</a>
			</EmpreintButton>
		</div>
	);
}
