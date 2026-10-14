import type { DisplayedSkillBadge } from "@/entities/skill";
import { type Locale, m } from "@/shared/i18n";

const SKILL_BADGE_LABELS: Record<
	DisplayedSkillBadge,
	(locale: Locale) => string
> = {
	project: (locale) => m.badge_project({}, { locale }),
	feature: (locale) => m.badge_feature({}, { locale }),
	story: (locale) => m.badge_story({}, { locale }),
	lane: (locale) => m.badge_lane({}, { locale }),
	review: (locale) => m.badge_review({}, { locale }),
};

export function getSkillBadgeLabel(
	badge: DisplayedSkillBadge,
	locale: Locale,
): string {
	return SKILL_BADGE_LABELS[badge](locale);
}
