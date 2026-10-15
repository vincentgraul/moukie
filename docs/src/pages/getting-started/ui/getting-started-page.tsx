import {
	List as EmpreintList,
	ListItem as EmpreintListItem,
	Text as EmpreintText,
} from "@empreint/ui";
import { ArrowBigRightIcon } from "lucide-react";
import { m, useLocale } from "@/shared/i18n";
import { CommandBlock, OverviewLayout } from "@/shared/ui";
import type { InstallCommands } from "../model/install-commands";
import styles from "./getting-started-page.module.css";
import { GettingStartedSection } from "./getting-started-section";

export type GettingStartedPageProps = {
	readonly commands: InstallCommands;
};

export function GettingStartedPage({ commands }: GettingStartedPageProps) {
	const locale = useLocale();
	const options = { locale };
	const requirements = [
		m.requirement_claude_code({}, options),
		m.requirement_git_cli({}, options),
		m.requirement_figma_mcp({}, options),
	];

	function renderCommand(command: string) {
		return (
			<CommandBlock
				key={command}
				command={command}
				copyLabel={m.copy_command({}, options)}
				copiedLabel={m.copied({}, options)}
			/>
		);
	}

	return (
		<OverviewLayout
			title={m.getting_started_title({}, options)}
			introduction={
				<>
					<span>{m.getting_started_intro_context({}, options)}</span>{" "}
					<span className={styles.introductionLine}>
						{m.getting_started_intro_flow({}, options)}
					</span>
				</>
			}
		>
			<GettingStartedSection
				title={m.requirements_title({}, options)}
				gap="compact"
			>
				<EmpreintText size="3" weight="medium">
					{m.requirements_lead({}, options)}
				</EmpreintText>
				<EmpreintList>
					{requirements.map((requirement) => (
						<EmpreintListItem key={requirement}>
							<ArrowBigRightIcon className={styles.arrow} aria-hidden="true" />
							<EmpreintText as="span" size="3" weight="medium">
								{requirement}
							</EmpreintText>
						</EmpreintListItem>
					))}
				</EmpreintList>
			</GettingStartedSection>
			<GettingStartedSection
				title={m.installation_title({}, options)}
				gap="spacious"
			>
				{renderCommand(commands.addMarketplace)}
				{renderCommand(commands.installPlugin)}
				<EmpreintText size="3" weight="medium">
					{m.installation_done({}, options)}
				</EmpreintText>
			</GettingStartedSection>
			<GettingStartedSection title={m.update_title({}, options)} gap="spacious">
				{renderCommand(commands.updateMarketplace)}
				{renderCommand(commands.updatePlugin)}
			</GettingStartedSection>
		</OverviewLayout>
	);
}
