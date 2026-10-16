import { createFileRoute } from "@tanstack/react-router";
import { AppHomeLayout } from "@/app/layout";
import { createPageHead } from "@/app/seo";
import { HomePage } from "@/pages/home";
import { SITE_NAME } from "@/shared/config";
import { m } from "@/shared/i18n";

export const Route = createFileRoute("/$locale/")({
	head: ({ params }) =>
		createPageHead({
			locale: params.locale,
			title: SITE_NAME,
			description: m.home_subtitle({}, { locale: params.locale }),
		}),
	component: HomeRoute,
});

function HomeRoute() {
	return (
		<AppHomeLayout>
			<HomePage />
		</AppHomeLayout>
	);
}
