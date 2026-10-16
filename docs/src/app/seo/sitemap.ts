export function createSitemap(urls: readonly string[]): string {
	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...urls.map((url) => `  <url><loc>${url}</loc></url>`),
		"</urlset>",
		"",
	].join("\n");
}
