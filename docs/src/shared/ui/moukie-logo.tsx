import moukieLogo from "./moukie-logo.svg";

export type MoukieLogoProps = {
	readonly className?: string;
};

export function MoukieLogo({ className }: MoukieLogoProps) {
	return <img className={className} src={moukieLogo} alt="" />;
}
