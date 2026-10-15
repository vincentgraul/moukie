import type { ReactNode } from "react";
import { AppHeader } from "./app-header";
import styles from "./app-home-layout.module.css";

export type AppHomeLayoutProps = {
	readonly children: ReactNode;
};

export function AppHomeLayout({ children }: AppHomeLayoutProps) {
	return (
		<div className={styles.appHomeLayout}>
			<AppHeader withMobileMenu={false} />
			<main className={styles.main}>{children}</main>
		</div>
	);
}
