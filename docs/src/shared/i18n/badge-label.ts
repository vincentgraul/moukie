import { m } from "./paraglide/messages.js";
import type { Locale } from "./paraglide/runtime.js";

export type LabelledBadge = "project" | "feature" | "story" | "lane" | "review";

const BADGE_LABELS: Readonly<
	Record<LabelledBadge, (locale: Locale) => string>
> = {
	project: (locale) => m.badge_project({}, { locale }),
	feature: (locale) => m.badge_feature({}, { locale }),
	story: (locale) => m.badge_story({}, { locale }),
	lane: (locale) => m.badge_lane({}, { locale }),
	review: (locale) => m.badge_review({}, { locale }),
};

export function getBadgeLabel(badge: LabelledBadge, locale: Locale): string {
	return BADGE_LABELS[badge](locale);
}
