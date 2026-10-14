import { createFileRoute } from "@tanstack/react-router";
import { getPluginItemCards } from "@/entities/plugin-item";
import { SkillsPage } from "@/pages/skills";
import { formatDocumentTitle } from "@/shared/config";
import { m } from "@/shared/i18n";

export const Route = createFileRoute("/$locale/_layout/skills")({
	loader: ({ params }) =>
		getPluginItemCards({ data: { source: "skills", locale: params.locale } }),
	head: ({ params }) => ({
		meta: [
			{
				title: formatDocumentTitle(
					m.skills_title({}, { locale: params.locale }),
				),
			},
		],
	}),
	component: SkillsRoute,
});

function SkillsRoute() {
	return <SkillsPage cards={Route.useLoaderData()} />;
}
