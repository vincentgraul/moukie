import { Text as EmpreintText, Title as EmpreintTitle } from "@empreint/ui";
import type { AgentCardView } from "@/entities/agent";
import { getBadgeLabel, m, useLocale } from "@/shared/i18n";
import { OverviewCard, OverviewCardGrid } from "@/shared/ui";
import styles from "./agents-page.module.css";

export type AgentsPageProps = {
	readonly cards: readonly AgentCardView[];
};

export function AgentsPage({ cards }: AgentsPageProps) {
	const locale = useLocale();

	return (
		<div className={styles.agentsPage}>
			<EmpreintTitle as="h1" size="7" weight="bold" className={styles.title}>
				{m.agents_title({}, { locale })}
			</EmpreintTitle>
			<EmpreintText size="3" weight="medium">
				{m.agents_intro({}, { locale })}
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
