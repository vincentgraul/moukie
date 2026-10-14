import type { ReactNode } from "react";
import { AppHeader } from "./app-header";
import styles from "./app-layout.module.css";
import { AppSidebar } from "./app-sidebar";

export type AppLayoutProps = {
	readonly children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
	return (
		<div className={styles.appLayout}>
			<div className={styles.sidebar}>
				<AppSidebar />
			</div>
			<div className={styles.column}>
				<AppHeader />
				<main className={styles.main}>{children}</main>
			</div>
		</div>
	);
}
