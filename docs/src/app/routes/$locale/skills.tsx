import { createFileRoute } from "@tanstack/react-router";
import { getSkillCards } from "@/entities/skill";
import { SkillsPage } from "@/pages/skills";
import { formatDocumentTitle } from "@/shared/config";
import { m } from "@/shared/i18n";

export const Route = createFileRoute("/$locale/skills")({
	loader: () => getSkillCards(),
	staleTime: Number.POSITIVE_INFINITY,
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
