import type { SkillCardView } from "@/entities/skill";
import { getBadgeLabel, m, useLocale } from "@/shared/i18n";
import { OverviewCard, OverviewCardGrid, OverviewLayout } from "@/shared/ui";

export type SkillsPageProps = {
	readonly cards: readonly SkillCardView[];
};

export function SkillsPage({ cards }: SkillsPageProps) {
	const locale = useLocale();

	return (
		<OverviewLayout
			title={m.skills_title({}, { locale })}
			introduction={m.skills_intro({}, { locale })}
		>
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
		</OverviewLayout>
	);
}
