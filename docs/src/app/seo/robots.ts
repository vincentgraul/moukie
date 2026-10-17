export function createRobots(sitemapUrl: string): string {
	return ["User-agent: *", "Allow: /", `Sitemap: ${sitemapUrl}`, ""].join("\n");
}
