export type InstallCommands = {
	readonly addMarketplace: string;
	readonly installPlugin: string;
	readonly updateMarketplace: string;
	readonly updatePlugin: string;
};

export type InstallCommandsSource = {
	readonly repositoryUrl: string;
	readonly marketplaceName: string;
	readonly pluginName: string;
};

function toRepositorySlug(repositoryUrl: string): string {
	return new URL(repositoryUrl).pathname.replace(/^\/|\/$/g, "");
}

export function buildInstallCommands({
	repositoryUrl,
	marketplaceName,
	pluginName,
}: InstallCommandsSource): InstallCommands {
	const pluginReference = `${pluginName}@${marketplaceName}`;
	return {
		addMarketplace: `claude plugin marketplace add ${toRepositorySlug(repositoryUrl)}`,
		installPlugin: `claude plugin install ${pluginReference}`,
		updateMarketplace: `claude plugin marketplace update ${marketplaceName}`,
		updatePlugin: `claude plugin update ${pluginReference}`,
	};
}
