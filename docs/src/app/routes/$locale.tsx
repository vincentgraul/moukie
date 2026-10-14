import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { AppLayout } from "@/app/layout";
import { isPublishedLocale } from "@/shared/i18n";

export const Route = createFileRoute("/$locale")({
	params: {
		parse: ({ locale }) => {
			if (!isPublishedLocale(locale)) {
				throw notFound();
			}
			return { locale };
		},
		stringify: ({ locale }) => ({ locale }),
	},
	component: LocaleRoute,
});

function LocaleRoute() {
	return (
		<AppLayout>
			<Outlet />
		</AppLayout>
	);
}
