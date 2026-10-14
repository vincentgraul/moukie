import { createFileRoute, notFound } from "@tanstack/react-router";
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
});
