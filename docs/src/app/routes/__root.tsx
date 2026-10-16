import empreintCss from "@empreint/ui/styles.css?url";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AppNotFound } from "@/app/layout";
import globalCss from "@/app/styles/global.css?url";
import { createRootTitleMeta } from "@/pages/not-found";
import { useLocale } from "@/shared/i18n";

export const Route = createRootRoute({
	head: ({ match }) => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			...createRootTitleMeta(match._notFound === true),
		],
		links: [
			{ rel: "stylesheet", href: empreintCss },
			{ rel: "stylesheet", href: globalCss },
		],
	}),
	shellComponent: RootDocument,
	notFoundComponent: AppNotFound,
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
