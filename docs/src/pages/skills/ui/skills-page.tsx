import { Text as EmpreintText, Title as EmpreintTitle } from "@empreint/ui";
import type { SkillCardView } from "@/entities/skill";
import { getBadgeLabel, m, useLocale } from "@/shared/i18n";
import { OverviewCard, OverviewCardGrid } from "@/shared/ui";
import styles from "./skills-page.module.css";

export type SkillsPageProps = {
	readonly cards: readonly SkillCardView[];
};

export function SkillsPage({ cards }: SkillsPageProps) {
	const locale = useLocale();

	return (
		<div className={styles.skillsPage}>
			<EmpreintTitle as="h1" size="7" weight="bold" className={styles.title}>
				{m.skills_title({}, { locale })}
			</EmpreintTitle>
			<EmpreintText size="3" weight="medium">
				{m.skills_intro({}, { locale })}
			</EmpreintText>
			<OverviewCardGrid>
				{cards.map((card) => (
					<OverviewCard
						key={card.name}
						iconMarkup={card.iconMarkup}
						name={card.name}
						badgeLabel={getBadgeLabel(card.badge, locale)}
						summary={card.summary}
						produces={card.produces}
					/>
				))}
			</OverviewCardGrid>
		</div>
	);
}
