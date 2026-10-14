import styles from "./inline-svg.module.css";

export type InlineSvgProps = {
	readonly markup: string;
};

export function InlineSvg({ markup }: InlineSvgProps) {
	return (
		<span
			className={styles.inlineSvg}
			dangerouslySetInnerHTML={{ __html: markup }}
		/>
	);
}
