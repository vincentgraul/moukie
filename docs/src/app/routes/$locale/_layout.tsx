import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppLayout } from "@/app/layout";

export const Route = createFileRoute("/$locale/_layout")({
	component: LayoutRoute,
});

function LayoutRoute() {
	return (
		<AppLayout>
			<Outlet />
		</AppLayout>
	);
}
