import { describe, expect, it } from "vitest";
import { createEnglishRedirectScript } from "./english-redirect-script";

type Location = { pathname: string; replace: (url: string) => void };

function runScript(pathname: string) {
	const replaced: string[] = [];
	const location: Location = {
		pathname,
		replace: (url) => replaced.push(url),
	};
	new Function(
		"location",
		createEnglishRedirectScript("/moukie/en/", "/moukie/en/404/"),
	)(location);
	return replaced;
}

describe("createEnglishRedirectScript", () => {
	it("sends an unknown URL under the English site to the English 404", () => {
		expect(runScript("/moukie/en/unknown/")).toEqual(["/moukie/en/404/"]);
		expect(runScript("/moukie/en/skills/missing")).toEqual(["/moukie/en/404/"]);
	});

	it("leaves any other unknown URL on the French 404", () => {
		expect(runScript("/moukie/unknown/")).toEqual([]);
		expect(runScript("/moukie/fr/unknown/")).toEqual([]);
		expect(runScript("/moukie/english/")).toEqual([]);
		expect(runScript("/moukie/404.html")).toEqual([]);
	});
});
