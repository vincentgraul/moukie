import { Text as EmpreintText, Title as EmpreintTitle } from "@empreint/ui";
import type { ReactNode } from "react";
import styles from "./overview-layout.module.css";

export type OverviewLayoutProps = {
	readonly title: string;
	readonly introduction: string;
	readonly children: ReactNode;
};

export function OverviewLayout({
	title,
	introduction,
	children,
}: OverviewLayoutProps) {
	return (
		<div className={styles.overviewLayout}>
			<EmpreintTitle as="h1" size="7" weight="bold" className={styles.title}>
				{title}
			</EmpreintTitle>
			<EmpreintText size="3" weight="medium">
				{introduction}
			</EmpreintText>
			{children}
		</div>
	);
}
