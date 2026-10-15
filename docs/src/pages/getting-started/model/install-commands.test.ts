import { describe, expect, it } from "vitest";
import { buildInstallCommands } from "./install-commands";

describe("install commands", () => {
	it("builds the four terminal commands from the repository, the marketplace and the plugin", () => {
		expect(
			buildInstallCommands({
				repositoryUrl: "https://github.com/vincentgraul/moukie",
				marketplaceName: "vincentgraul",
				pluginName: "moukie",
			}),
		).toEqual({
			addMarketplace: "claude plugin marketplace add vincentgraul/moukie",
			installPlugin: "claude plugin install moukie@vincentgraul",
			updateMarketplace: "claude plugin marketplace update vincentgraul",
			updatePlugin: "claude plugin update moukie@vincentgraul",
		});
	});

	it("follows the marketplace and plugin names instead of hardcoding them", () => {
		expect(
			buildInstallCommands({
				repositoryUrl: "https://github.com/someone/other/",
				marketplaceName: "market",
				pluginName: "tool",
			}),
		).toEqual({
			addMarketplace: "claude plugin marketplace add someone/other",
			installPlugin: "claude plugin install tool@market",
			updateMarketplace: "claude plugin marketplace update market",
			updatePlugin: "claude plugin update tool@market",
		});
	});
});
