const SITE_URL = "https://vincentgraul.github.io/moukie/";

export function toAbsoluteUrl(path: string): string {
	return new URL(path.replace(/^\//, ""), SITE_URL).href;
}
