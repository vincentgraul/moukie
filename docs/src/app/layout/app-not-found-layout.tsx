import type { ReactNode } from "react";
import { AppHeader } from "./app-header";
import styles from "./app-not-found-layout.module.css";

export type AppNotFoundLayoutProps = {
	readonly children: ReactNode;
};

export function AppNotFoundLayout({ children }: AppNotFoundLayoutProps) {
	return (
		<div className={styles.appNotFoundLayout}>
			<AppHeader withMobileMenu={false} languageDestination="home" />
			<main className={styles.main}>{children}</main>
		</div>
	);
}
