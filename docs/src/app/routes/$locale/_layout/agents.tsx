import { createFileRoute } from "@tanstack/react-router";
import { getPluginItemCards } from "@/entities/plugin-item";
import { AgentsPage } from "@/pages/agents";
import { formatDocumentTitle } from "@/shared/config";
import { m } from "@/shared/i18n";

export const Route = createFileRoute("/$locale/_layout/agents")({
	loader: ({ params }) =>
		getPluginItemCards({ data: { source: "agents", locale: params.locale } }),
	head: ({ params }) => ({
		meta: [
			{
				title: formatDocumentTitle(
					m.agents_title({}, { locale: params.locale }),
				),
			},
		],
	}),
	component: AgentsRoute,
});

function AgentsRoute() {
	return <AgentsPage cards={Route.useLoaderData()} />;
}
