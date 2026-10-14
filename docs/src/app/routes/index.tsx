import { createFileRoute } from "@tanstack/react-router";
import { toSiteUrl } from "@/shared/config";
import { baseLocale, m } from "@/shared/i18n";
import { StaticRedirect, staticRedirectMeta } from "@/shared/ui";

const TARGET_URL = toSiteUrl(`${baseLocale}/skills`);

export const Route = createFileRoute("/")({
	head: () => ({ meta: staticRedirectMeta(TARGET_URL) }),
	component: IndexRoute,
});

function IndexRoute() {
	return (
		<StaticRedirect
			href={TARGET_URL}
			label={m.redirect_link({}, { locale: baseLocale })}
		/>
	);
}
