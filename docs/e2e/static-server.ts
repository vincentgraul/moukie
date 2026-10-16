import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const ROOT_DIRECTORY = resolve(import.meta.dirname, "../dist/client");
const BASE_PATH = "/moukie/";
const NOT_FOUND_FILE = join(ROOT_DIRECTORY, "404.html");
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

type Resolution =
	| { readonly kind: "file"; readonly file: string }
	| { readonly kind: "directory-without-slash" }
	| { readonly kind: "missing" };

function resolvePath(pathname: string): Resolution {
	if (`${pathname}/` === BASE_PATH) {
		return { kind: "directory-without-slash" };
	}
	if (!pathname.startsWith(BASE_PATH)) {
		return { kind: "missing" };
	}
	const relativePath = normalize(
		decodeURIComponent(pathname.slice(BASE_PATH.length)),
	);
	const candidate = join(ROOT_DIRECTORY, relativePath);
	if (!candidate.startsWith(ROOT_DIRECTORY) || !existsSync(candidate)) {
		return { kind: "missing" };
	}
	if (statSync(candidate).isFile()) {
		return { kind: "file", file: candidate };
	}
	if (!pathname.endsWith("/")) {
		return { kind: "directory-without-slash" };
	}
	const index = join(candidate, "index.html");
	return existsSync(index)
		? { kind: "file", file: index }
		: { kind: "missing" };
}

createServer((request, response) => {
	const { pathname, search } = new URL(request.url ?? "/", "http://localhost");
	const resolution = resolvePath(pathname);
	if (resolution.kind === "directory-without-slash") {
		response.writeHead(301, { location: `${pathname}/${search}` });
		response.end();
		return;
	}
	if (resolution.kind === "missing") {
		if (pathname.startsWith(BASE_PATH) && existsSync(NOT_FOUND_FILE)) {
			response.writeHead(404, { "content-type": CONTENT_TYPES[".html"] });
			createReadStream(NOT_FOUND_FILE).pipe(response);
			return;
		}
		response.writeHead(404, { "content-type": "text/plain" });
		response.end("Not found");
		return;
	}
	response.writeHead(200, {
		"content-type":
			CONTENT_TYPES[extname(resolution.file)] ?? "application/octet-stream",
	});
	createReadStream(resolution.file).pipe(response);
}).listen(PORT);
