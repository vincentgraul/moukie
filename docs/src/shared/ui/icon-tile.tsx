import type { ReactNode } from "react";
import styles from "./icon-tile.module.css";

export type IconTileProps = {
	readonly children: ReactNode;
};

export function IconTile({ children }: IconTileProps) {
	return (
		<span className={styles.iconTile} aria-hidden="true">
			{children}
		</span>
	);
}
