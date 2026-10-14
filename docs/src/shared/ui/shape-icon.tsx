import { Icon, type LucideProps } from "lucide-react";
import type { IconShape } from "@/shared/lib";

export type ShapeIconProps = Omit<LucideProps, "ref"> & {
	readonly name: string;
	readonly shape: IconShape;
};

export function ShapeIcon({ name, shape, className, ...rest }: ShapeIconProps) {
	return (
		<Icon
			{...rest}
			className={[`lucide-${name}`, className].filter(Boolean).join(" ")}
			iconNode={shape.map(([tag, attributes]) => [tag, { ...attributes }])}
		/>
	);
}
