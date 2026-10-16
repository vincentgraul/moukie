import { createFileRoute } from "@tanstack/react-router";
import { AppNotFound } from "@/app/layout";
import { createNotFoundMeta } from "@/pages/not-found";

export const Route = createFileRoute("/$locale/404")({
	head: ({ params }) => ({ meta: createNotFoundMeta(params.locale) }),
	component: AppNotFound,
});
