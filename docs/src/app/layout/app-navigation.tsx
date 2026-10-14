import {
	SidebarGroup as EmpreintSidebarGroup,
	SidebarItem as EmpreintSidebarItem,
	SidebarLink as EmpreintSidebarLink,
} from "@empreint/ui";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { useLocale } from "@/shared/i18n";
import styles from "./app-navigation.module.css";
import { NAVIGATION_ENTRIES } from "./navigation";
import { NavigationEntryContent } from "./navigation-entry-content";

export type AppNavigationProps = {
	readonly onNavigate?: () => void;
};

export function AppNavigation({ onNavigate }: AppNavigationProps) {
	const locale = useLocale();
	const matchRoute = useMatchRoute();

	return (
		<EmpreintSidebarGroup className={styles.appNavigation}>
			{NAVIGATION_ENTRIES.map((entry) =>
				entry.to === undefined ? (
					<EmpreintSidebarItem
						key={entry.id}
						className={styles.disabledEntry}
						disabled
					>
						<NavigationEntryContent entry={entry} locale={locale} />
					</EmpreintSidebarItem>
				) : (
					<EmpreintSidebarLink
						key={entry.id}
						className={styles.entry}
						isActive={Boolean(matchRoute({ to: entry.to, params: { locale } }))}
					>
						<Link
							to={entry.to}
							params={{ locale }}
							reloadDocument
							onClick={onNavigate}
						>
							<NavigationEntryContent entry={entry} locale={locale} />
						</Link>
					</EmpreintSidebarLink>
				),
			)}
		</EmpreintSidebarGroup>
	);
}
