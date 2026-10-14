import { useEffect } from "react";

export type StaticRedirectProps = {
	readonly href: string;
	readonly label: string;
};

export function StaticRedirect({ href, label }: StaticRedirectProps) {
	useEffect(() => {
		window.location.replace(href);
	}, [href]);

	return (
		<main>
			<a href={href}>{label}</a>
		</main>
	);
}

export function staticRedirectMeta(href: string) {
	return [
		{ httpEquiv: "refresh", content: `0; url=${href}` },
		{ name: "robots", content: "noindex" },
	];
}
