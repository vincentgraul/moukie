import { createFileRoute } from "@tanstack/react-router";
import { AppNotFoundLayout } from "@/app/layout";
import { NotFoundPage } from "@/pages/not-found";

export const Route = createFileRoute("/404")({
	component: NotFoundRoute,
});

function NotFoundRoute() {
	return (
		<AppNotFoundLayout>
			<NotFoundPage />
		</AppNotFoundLayout>
	);
}
