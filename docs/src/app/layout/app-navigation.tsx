import {
	SidebarGroup as EmpreintSidebarGroup,
	SidebarItem as EmpreintSidebarItem,
	SidebarLink as EmpreintSidebarLink,
} from "@empreint/ui";
import { useLocation } from "@tanstack/react-router";
import { isSitePage, toPagePath, toSiteUrl } from "@/shared/config";
import { useLocale } from "@/shared/i18n";
import styles from "./app-navigation.module.css";
import { NAVIGATION_ENTRIES } from "./navigation";
import { NavigationEntryContent } from "./navigation-entry-content";

export type AppNavigationProps = {
	readonly onNavigate?: () => void;
};

function withoutTrailingSlash(path: string) {
	return path.replace(/\/+$/, "");
}

export function AppNavigation({ onNavigate }: AppNavigationProps) {
	const locale = useLocale();
	const currentPath = useLocation({
		select: (location) => withoutTrailingSlash(location.pathname),
	});

	return (
		<EmpreintSidebarGroup className={styles.appNavigation}>
			{NAVIGATION_ENTRIES.map((entry) => {
				if (!isSitePage(entry.page)) {
					return (
						<EmpreintSidebarItem
							key={entry.page}
							className={styles.disabledEntry}
							disabled
						>
							<NavigationEntryContent entry={entry} locale={locale} />
						</EmpreintSidebarItem>
					);
				}
				const pagePath = toPagePath(locale, entry.page);
				const isActive = currentPath === withoutTrailingSlash(pagePath);
				return (
					<EmpreintSidebarLink
						key={entry.page}
						className={styles.entry}
						isActive={isActive}
					>
						<a
							href={toSiteUrl(pagePath)}
							aria-current={isActive ? "page" : undefined}
							onClick={onNavigate}
						>
							<NavigationEntryContent entry={entry} locale={locale} />
						</a>
					</EmpreintSidebarLink>
				);
			})}
		</EmpreintSidebarGroup>
	);
}
