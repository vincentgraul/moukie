import { createFileRoute } from "@tanstack/react-router";
import { createPageHead } from "@/app/seo";
import {
	GettingStartedPage,
	getInstallCommands,
} from "@/pages/getting-started";
import { formatDocumentTitle } from "@/shared/config";
import { m } from "@/shared/i18n";

export const Route = createFileRoute("/$locale/_layout/getting-started")({
	loader: () => getInstallCommands(),
	head: ({ params }) => {
		const options = { locale: params.locale };
		return createPageHead({
			locale: params.locale,
			page: "getting-started",
			title: formatDocumentTitle(m.getting_started_title({}, options)),
			description: `${m.getting_started_intro_context({}, options)} ${m.getting_started_intro_flow({}, options)}`,
		});
	},
	component: GettingStartedRoute,
});

function GettingStartedRoute() {
	return <GettingStartedPage commands={Route.useLoaderData()} />;
}
