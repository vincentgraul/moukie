import type { PluginItemCardView } from "@/entities/plugin-item";
import { getBadgeLabel, m, useLocale } from "@/shared/i18n";
import { OverviewCard, OverviewCardGrid, OverviewLayout } from "@/shared/ui";

export type AgentsPageProps = {
	readonly cards: readonly PluginItemCardView[];
};

export function AgentsPage({ cards }: AgentsPageProps) {
	const locale = useLocale();

	return (
		<OverviewLayout
			title={m.agents_title({}, { locale })}
			introduction={m.agents_intro({}, { locale })}
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
