import { createFileRoute } from "@tanstack/react-router";
import { AppHomeLayout } from "@/app/layout";
import { HomePage } from "@/pages/home";

export const Route = createFileRoute("/$locale/")({
	component: HomeRoute,
});

function HomeRoute() {
	return (
		<AppHomeLayout>
			<HomePage />
		</AppHomeLayout>
	);
}
