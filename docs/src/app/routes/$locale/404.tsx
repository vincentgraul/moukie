import { createFileRoute } from "@tanstack/react-router";
import { AppNotFoundLayout } from "@/app/layout";
import { createNotFoundMeta, NotFoundPage } from "@/pages/not-found";

export const Route = createFileRoute("/$locale/404")({
	head: ({ params }) => ({ meta: createNotFoundMeta(params.locale) }),
	component: NotFoundRoute,
});

function NotFoundRoute() {
	return (
		<AppNotFoundLayout>
			<NotFoundPage />
		</AppNotFoundLayout>
	);
}
