import { Grid as EmpreintGrid } from "@empreint/ui";
import type { ReactNode } from "react";
import styles from "./overview-card-grid.module.css";

export type OverviewCardGridProps = {
	readonly children: ReactNode;
};

export function OverviewCardGrid({ children }: OverviewCardGridProps) {
	return (
		<EmpreintGrid className={styles.overviewCardGrid} role="list">
			{children}
		</EmpreintGrid>
	);
}
