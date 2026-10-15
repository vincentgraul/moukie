import {
	Separator as EmpreintSeparator,
	Title as EmpreintTitle,
} from "@empreint/ui";
import { type ReactNode, useId } from "react";
import styles from "./getting-started-section.module.css";

export type GettingStartedSectionProps = {
	readonly title: string;
	readonly gap: "compact" | "spacious";
	readonly children: ReactNode;
};

export function GettingStartedSection({
	title,
	gap,
	children,
}: GettingStartedSectionProps) {
	const titleId = useId();

	return (
		<section
			className={styles.section}
			data-gap={gap}
			aria-labelledby={titleId}
		>
			<EmpreintSeparator size="3" className={styles.separator}>
				<EmpreintTitle
					id={titleId}
					as="h2"
					size="4"
					weight="bold"
					className={styles.title}
				>
					{title}
				</EmpreintTitle>
			</EmpreintSeparator>
			{children}
		</section>
	);
}
