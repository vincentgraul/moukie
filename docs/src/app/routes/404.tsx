import { createFileRoute } from "@tanstack/react-router";
import { AppNotFound } from "@/app/layout";
import {
	createEnglishRedirectScript,
	createNotFoundMeta,
} from "@/pages/not-found";
import { toPagePath, toSiteUrl } from "@/shared/config";
import { baseLocale } from "@/shared/i18n";

export const Route = createFileRoute("/404")({
	head: () => ({
		meta: createNotFoundMeta(baseLocale),
		scripts: [
			{
				children: createEnglishRedirectScript(
					toSiteUrl(toPagePath("en")),
					toSiteUrl(`${toPagePath("en")}404/`),
				),
			},
		],
	}),
	component: AppNotFound,
});
