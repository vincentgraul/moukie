import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const ROOT_DIRECTORY = resolve(import.meta.dirname, "../dist/client");
const BASE_PATH = "/moukie/";
const PORT = Number(process.env.PORT ?? 3000);

const CONTENT_TYPES: Readonly<Record<string, string>> = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".svg": "image/svg+xml",
	".png": "image/png",
	".woff2": "font/woff2",
	".json": "application/json",
	".xml": "application/xml",
};

function resolveFile(pathname: string) {
	if (!pathname.startsWith(BASE_PATH)) {
		return undefined;
	}
	const relativePath = normalize(
		decodeURIComponent(pathname.slice(BASE_PATH.length)),
	);
	const candidate = join(ROOT_DIRECTORY, relativePath);
	if (!candidate.startsWith(ROOT_DIRECTORY)) {
		return undefined;
	}
	if (existsSync(candidate) && statSync(candidate).isFile()) {
		return candidate;
	}
	const index = join(candidate, "index.html");
	return existsSync(index) ? index : undefined;
}

createServer((request, response) => {
	const { pathname } = new URL(request.url ?? "/", "http://localhost");
	const file = resolveFile(pathname);
	if (file === undefined) {
		response.writeHead(404, { "content-type": "text/plain" });
		response.end("Not found");
		return;
	}
	response.writeHead(200, {
		"content-type": CONTENT_TYPES[extname(file)] ?? "application/octet-stream",
	});
	createReadStream(file).pipe(response);
}).listen(PORT);
