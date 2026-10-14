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
import type { SkillCardView } from "@/entities/skill";
import { getBadgeLabel, type Locale } from "@/shared/i18n";
import { IconTile, ShapeIcon } from "@/shared/ui";
import styles from "./skill-overview-card.module.css";

export type SkillOverviewCardProps = {
	readonly card: SkillCardView;
	readonly locale: Locale;
};

export function SkillOverviewCard({ card, locale }: SkillOverviewCardProps) {
	return (
		<EmpreintCard className={styles.skillOverviewCard} role="listitem">
			<EmpreintCardHeader className={styles.header}>
				<IconTile>
					<ShapeIcon name={card.iconName} shape={card.iconShape} />
				</IconTile>
				<EmpreintTitle as="h2" size="2" weight="bold" className={styles.name}>
					{card.name}
				</EmpreintTitle>
				<EmpreintBadge variant="solid" className={styles.badge}>
					{getBadgeLabel(card.badge, locale)}
				</EmpreintBadge>
			</EmpreintCardHeader>
			<EmpreintCardBody>
				<EmpreintText size="3" weight="medium">
					{card.summary}
				</EmpreintText>
			</EmpreintCardBody>
			{card.produces ? (
				<EmpreintCardFooter className={styles.footer}>
					<ArrowBigRightIcon className={styles.arrow} aria-hidden="true" />
					<EmpreintText as="span" size="2" weight="medium">
						{card.produces}
					</EmpreintText>
				</EmpreintCardFooter>
			) : null}
		</EmpreintCard>
	);
}
