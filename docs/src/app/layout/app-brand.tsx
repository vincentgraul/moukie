import { Text as EmpreintText } from "@empreint/ui";
import { SITE_NAME, toPagePath, toSiteUrl } from "@/shared/config";
import { useLocale } from "@/shared/i18n";
import { MoukieLogo } from "@/shared/ui";
import styles from "./app-brand.module.css";

export type AppBrandProps = {
	readonly layout: "stacked" | "inline";
	readonly onNavigate?: () => void;
};

export function AppBrand({ layout, onNavigate }: AppBrandProps) {
	const locale = useLocale();

	return (
		<a
			className={styles.appBrand}
			data-layout={layout}
			href={toSiteUrl(toPagePath(locale))}
			onClick={onNavigate}
		>
			<MoukieLogo className={styles.logo} />
			<EmpreintText as="span" size="6" weight="bold">
				{SITE_NAME}
			</EmpreintText>
		</a>
	);
}
