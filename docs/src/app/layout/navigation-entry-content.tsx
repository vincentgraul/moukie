import type { Locale } from "@/shared/i18n";
import { IconTile } from "@/shared/ui";
import type { NavigationEntry } from "./navigation";
import styles from "./navigation-entry-content.module.css";

export type NavigationEntryContentProps = {
	readonly entry: NavigationEntry;
	readonly locale: Locale;
};

export function NavigationEntryContent({
	entry,
	locale,
}: NavigationEntryContentProps) {
	const EntryIcon = entry.icon;
	return (
		<>
			<IconTile>
				<EntryIcon />
			</IconTile>
			<span className={styles.label}>{entry.label(locale)}</span>
		</>
	);
}
