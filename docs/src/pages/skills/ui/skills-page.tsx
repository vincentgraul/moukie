import {
	Grid as EmpreintGrid,
	Text as EmpreintText,
	Title as EmpreintTitle,
} from "@empreint/ui";
import type { SkillCardView } from "@/entities/skill";
import { m, useLocale } from "@/shared/i18n";
import { SkillCard } from "./skill-card";
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
			<EmpreintGrid className={styles.grid} role="list">
				{cards.map((card) => (
					<SkillCard key={card.name} card={card} locale={locale} />
				))}
			</EmpreintGrid>
		</div>
	);
}
