const SITE_URL = "https://moukie.dev/";

export function toAbsoluteUrl(path: string): string {
	return new URL(path.replace(/^\//, ""), SITE_URL).href;
}
