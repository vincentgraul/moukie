import { createFileRoute } from "@tanstack/react-router";
import { toPagePath, toSiteUrl } from "@/shared/config";
import { m } from "@/shared/i18n";
import { StaticRedirect, staticRedirectMeta } from "@/shared/ui";

function toSkillsUrl(locale: string) {
	return toSiteUrl(toPagePath(locale, "skills"));
}

export const Route = createFileRoute("/$locale/")({
	head: ({ params }) => ({
		meta: staticRedirectMeta(toSkillsUrl(params.locale)),
	}),
	component: LocaleIndexRoute,
});

function LocaleIndexRoute() {
	const { locale } = Route.useParams();
	return (
		<StaticRedirect
			href={toSkillsUrl(locale)}
			label={m.redirect_link({}, { locale })}
		/>
	);
}
