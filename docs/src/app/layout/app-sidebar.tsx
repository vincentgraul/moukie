import {
	Sidebar as EmpreintSidebar,
	SidebarHeader as EmpreintSidebarHeader,
} from "@empreint/ui";
import { m, useLocale } from "@/shared/i18n";
import { AppBrand } from "./app-brand";
import { AppNavigation } from "./app-navigation";
import styles from "./app-sidebar.module.css";

export function AppSidebar() {
	const locale = useLocale();

	return (
		<EmpreintSidebar
			className={styles.appSidebar}
			aria-label={m.navigation_label({}, { locale })}
		>
			<EmpreintSidebarHeader className={styles.header}>
				<AppBrand layout="stacked" />
			</EmpreintSidebarHeader>
			<AppNavigation />
		</EmpreintSidebar>
	);
}
