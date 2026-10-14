import {
	Sidebar as EmpreintSidebar,
	SidebarHeader as EmpreintSidebarHeader,
	Text as EmpreintText,
} from "@empreint/ui";
import { SITE_NAME } from "@/shared/config";
import { m, useLocale } from "@/shared/i18n";
import { AppNavigation } from "./app-navigation";
import styles from "./app-sidebar.module.css";
import moukieLogo from "./moukie-logo.svg";

export function AppSidebar() {
	const locale = useLocale();

	return (
		<EmpreintSidebar
			className={styles.appSidebar}
			aria-label={m.navigation_label({}, { locale })}
		>
			<EmpreintSidebarHeader className={styles.header}>
				<img src={moukieLogo} alt="" />
				<EmpreintText as="span" size="6" weight="bold">
					{SITE_NAME}
				</EmpreintText>
			</EmpreintSidebarHeader>
			<AppNavigation />
		</EmpreintSidebar>
	);
}
