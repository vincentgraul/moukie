import empreintCss from "@empreint/ui/styles.css?url";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AppNotFoundLayout } from "@/app/layout";
import globalCss from "@/app/styles/global.css?url";
import {
	createEnglishRedirectScript,
	createNotFoundMeta,
	NotFoundPage,
} from "@/pages/not-found";
import { SITE_NAME, toPagePath, toSiteUrl } from "@/shared/config";
import { baseLocale, useLocale } from "@/shared/i18n";

export const Route = createRootRoute({
	head: ({ match, matches }) => {
		const isFrenchNotFound =
			match._notFound ||
			matches.some(({ routeId }) => String(routeId) === "/404");
		return {
			meta: [
				{ charSet: "utf-8" },
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				...(isFrenchNotFound
					? createNotFoundMeta(baseLocale)
					: [{ title: SITE_NAME }]),
			],
			links: [
				{ rel: "stylesheet", href: empreintCss },
				{ rel: "stylesheet", href: globalCss },
			],
			scripts: isFrenchNotFound
				? [
						{
							children: createEnglishRedirectScript(
								toSiteUrl(toPagePath("en")),
								toSiteUrl(`${toPagePath("en")}404/`),
							),
						},
					]
				: [],
		};
	},
	shellComponent: RootDocument,
	notFoundComponent: RootNotFound,
});

function RootDocument({ children }: { children: ReactNode }) {
	const locale = useLocale();

	return (
		<html lang={locale}>
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}

function RootNotFound() {
	return (
		<AppNotFoundLayout>
			<NotFoundPage />
		</AppNotFoundLayout>
	);
}
