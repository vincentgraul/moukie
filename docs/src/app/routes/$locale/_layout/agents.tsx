import { createFileRoute } from "@tanstack/react-router";
import { createPageHead } from "@/app/seo";
import { getPluginItemCards } from "@/entities/plugin-item";
import { AgentsPage } from "@/pages/agents";
import { formatDocumentTitle } from "@/shared/config";
import { m } from "@/shared/i18n";

export const Route = createFileRoute("/$locale/_layout/agents")({
	loader: ({ params }) =>
		getPluginItemCards({ data: { source: "agents", locale: params.locale } }),
	head: ({ params }) => {
		const options = { locale: params.locale };
		return createPageHead({
			locale: params.locale,
			page: "agents",
			title: formatDocumentTitle(m.agents_title({}, options)),
			description: m.agents_intro({}, options),
		});
	},
	component: AgentsRoute,
});

function AgentsRoute() {
	return <AgentsPage cards={Route.useLoaderData()} />;
}
