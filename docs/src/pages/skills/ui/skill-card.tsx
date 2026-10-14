import {
	Badge as EmpreintBadge,
	Card as EmpreintCard,
	CardBody as EmpreintCardBody,
	CardFooter as EmpreintCardFooter,
	CardHeader as EmpreintCardHeader,
	Text as EmpreintText,
	Title as EmpreintTitle,
} from "@empreint/ui";
import { ArrowBigRight } from "lucide-react";
import type { SkillCardView } from "@/entities/skill";
import type { Locale } from "@/shared/i18n";
import { IconTile, ShapeIcon } from "@/shared/ui";
import { getSkillBadgeLabel } from "./skill-badge-label";
import styles from "./skill-card.module.css";

export type SkillCardProps = {
	readonly card: SkillCardView;
	readonly locale: Locale;
};

export function SkillCard({ card, locale }: SkillCardProps) {
	return (
		<EmpreintCard className={styles.skillCard} role="listitem">
			<EmpreintCardHeader className={styles.header}>
				<IconTile>
					<ShapeIcon shape={card.iconShape} />
				</IconTile>
				<EmpreintTitle as="h2" size="2" weight="bold" className={styles.name}>
					{card.name}
				</EmpreintTitle>
				<EmpreintBadge variant="solid" className={styles.badge}>
					{getSkillBadgeLabel(card.badge, locale)}
				</EmpreintBadge>
			</EmpreintCardHeader>
			<EmpreintCardBody>
				<EmpreintText size="3" weight="medium">
					{card.summary}
				</EmpreintText>
			</EmpreintCardBody>
			{card.produces ? (
				<EmpreintCardFooter className={styles.footer}>
					<ArrowBigRight className={styles.arrow} aria-hidden="true" />
					<EmpreintText as="span" size="2" weight="medium">
						{card.produces}
					</EmpreintText>
				</EmpreintCardFooter>
			) : null}
		</EmpreintCard>
	);
}
