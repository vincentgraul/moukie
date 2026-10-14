import { createFileRoute } from "@tanstack/react-router";
import { getAgentCards } from "@/entities/agent";
import { AgentsPage } from "@/pages/agents";
import { formatDocumentTitle } from "@/shared/config";
import { m } from "@/shared/i18n";

export const Route = createFileRoute("/$locale/_layout/agents")({
	loader: () => getAgentCards(),
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
