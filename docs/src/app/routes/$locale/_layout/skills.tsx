import { createFileRoute } from "@tanstack/react-router";
import { createPageHead } from "@/app/seo";
import { getPluginItemCards } from "@/entities/plugin-item";
import { SkillsPage } from "@/pages/skills";
import { formatDocumentTitle } from "@/shared/config";
import { m } from "@/shared/i18n";

export const Route = createFileRoute("/$locale/_layout/skills")({
	loader: ({ params }) =>
		getPluginItemCards({ data: { source: "skills", locale: params.locale } }),
	head: ({ params }) => {
		const options = { locale: params.locale };
		return createPageHead({
			locale: params.locale,
			page: "skills",
			title: formatDocumentTitle(m.skills_title({}, options)),
			description: m.skills_intro({}, options),
		});
	},
	component: SkillsRoute,
});

function SkillsRoute() {
	return <SkillsPage cards={Route.useLoaderData()} />;
}
