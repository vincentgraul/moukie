import { Icon, type LucideProps } from "lucide-react";
import type { IconShape } from "@/shared/lib";

export type ShapeIconProps = Omit<LucideProps, "ref"> & {
	readonly shape: IconShape;
};

export function ShapeIcon({ shape, ...rest }: ShapeIconProps) {
	return (
		<Icon
			{...rest}
			iconNode={shape.map(([tag, attributes]) => [tag, { ...attributes }])}
		/>
	);
}
