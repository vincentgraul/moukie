import {
	Badge as EmpreintBadge,
	Card as EmpreintCard,
	CardBody as EmpreintCardBody,
	CardFooter as EmpreintCardFooter,
	CardHeader as EmpreintCardHeader,
	Text as EmpreintText,
	Title as EmpreintTitle,
} from "@empreint/ui";
import { ArrowBigRightIcon } from "lucide-react";
import { IconTile } from "./icon-tile";
import { InlineSvg } from "./inline-svg";
import styles from "./overview-card.module.css";

export type OverviewCardProps = {
	readonly iconMarkup: string;
	readonly name: string;
	readonly badgeLabel: string;
	readonly summary: string;
	readonly produces?: string;
};

export function OverviewCard({
	iconMarkup,
	name,
	badgeLabel,
	summary,
	produces,
}: OverviewCardProps) {
	return (
		<EmpreintCard className={styles.overviewCard} role="listitem">
			<EmpreintCardHeader className={styles.header}>
				<IconTile>
					<InlineSvg markup={iconMarkup} />
				</IconTile>
				<EmpreintTitle as="h2" size="2" weight="bold" className={styles.name}>
					{name}
				</EmpreintTitle>
				<EmpreintBadge variant="solid" className={styles.badge}>
					{badgeLabel}
				</EmpreintBadge>
			</EmpreintCardHeader>
			<EmpreintCardBody>
				<EmpreintText size="3" weight="medium">
					{summary}
				</EmpreintText>
			</EmpreintCardBody>
			{produces ? (
				<EmpreintCardFooter className={styles.footer}>
					<ArrowBigRightIcon className={styles.arrow} aria-hidden="true" />
					<EmpreintText as="span" size="2" weight="medium">
						{produces}
					</EmpreintText>
				</EmpreintCardFooter>
			) : null}
		</EmpreintCard>
	);
}
