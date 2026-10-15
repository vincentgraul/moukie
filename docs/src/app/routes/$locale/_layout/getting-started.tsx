import { createFileRoute } from "@tanstack/react-router";
import {
	GettingStartedPage,
	getInstallCommands,
} from "@/pages/getting-started";
import { formatDocumentTitle } from "@/shared/config";
import { m } from "@/shared/i18n";

export const Route = createFileRoute("/$locale/_layout/getting-started")({
	loader: () => getInstallCommands(),
	head: ({ params }) => ({
		meta: [
			{
				title: formatDocumentTitle(
					m.getting_started_title({}, { locale: params.locale }),
				),
			},
		],
	}),
	component: GettingStartedRoute,
});

function GettingStartedRoute() {
	return <GettingStartedPage commands={Route.useLoaderData()} />;
}
