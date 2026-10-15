import { IconButton as EmpreintIconButton } from "@empreint/ui";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./command-block.module.css";

const COPIED_DURATION_IN_MS = 2000;

export type CommandBlockProps = {
	readonly command: string;
	readonly copyLabel: string;
	readonly copiedLabel: string;
};

export function CommandBlock({
	command,
	copyLabel,
	copiedLabel,
}: CommandBlockProps) {
	const [copiedAt, setCopiedAt] = useState<number | null>(null);
	const isCopied = copiedAt !== null;

	useEffect(() => {
		if (copiedAt === null) {
			return;
		}
		const timeout = setTimeout(() => setCopiedAt(null), COPIED_DURATION_IN_MS);
		return () => clearTimeout(timeout);
	}, [copiedAt]);

	async function copyCommand() {
		try {
			await navigator.clipboard.writeText(command);
			setCopiedAt(Date.now());
		} catch {
			setCopiedAt(null);
		}
	}

	return (
		<div className={styles.commandBlock}>
			<pre className={styles.command}>
				<code>{command}</code>
			</pre>
			<EmpreintIconButton
				variant="ghost"
				size="1"
				className={styles.copyButton}
				aria-label={copyLabel}
				onClick={copyCommand}
			>
				{isCopied ? (
					<CheckIcon aria-hidden="true" />
				) : (
					<CopyIcon aria-hidden="true" />
				)}
			</EmpreintIconButton>
			<span role="status" className={styles.status}>
				{isCopied ? copiedLabel : ""}
			</span>
		</div>
	);
}
