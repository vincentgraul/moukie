import { describe, expect, it } from "vitest";
import { createEnglishRedirectScript } from "./english-redirect-script";

type Location = { pathname: string; replace: (url: string) => void };

function runScript(pathname: string) {
	const replaced: string[] = [];
	const location: Location = {
		pathname,
		replace: (url) => replaced.push(url),
	};
	new Function("location", createEnglishRedirectScript("/en/", "/en/404/"))(
		location,
	);
	return replaced;
}

describe("createEnglishRedirectScript", () => {
	it("sends an unknown URL under the English site to the English 404", () => {
		expect(runScript("/en/unknown/")).toEqual(["/en/404/"]);
		expect(runScript("/en/skills/missing")).toEqual(["/en/404/"]);
	});

	it("leaves any other unknown URL on the French 404", () => {
		expect(runScript("/unknown/")).toEqual([]);
		expect(runScript("/fr/unknown/")).toEqual([]);
		expect(runScript("/english/")).toEqual([]);
		expect(runScript("/404.html")).toEqual([]);
	});
});
