import { IconButton as EmpreintIconButton, useDisclosure } from "@empreint/ui";
import { MenuIcon, XIcon } from "lucide-react";
import { useId } from "react";
import { m, useLocale } from "@/shared/i18n";
import { AppBrand } from "./app-brand";
import { AppNavigation } from "./app-navigation";
import styles from "./mobile-menu.module.css";

export function MobileMenu() {
	const locale = useLocale();
	const panelId = useId();
	const { isOpen, onToggle, onClose, ref } = useDisclosure();

	return (
		<div ref={ref} className={styles.mobileMenu}>
			<EmpreintIconButton
				variant="ghost"
				size="4"
				aria-expanded={isOpen}
				aria-controls={panelId}
				aria-label={
					isOpen ? m.menu_close({}, { locale }) : m.menu_open({}, { locale })
				}
				onClick={onToggle}
			>
				{isOpen ? <XIcon /> : <MenuIcon />}
			</EmpreintIconButton>
			{isOpen ? (
				<nav
					id={panelId}
					className={styles.panel}
					aria-label={m.navigation_label({}, { locale })}
				>
					<AppBrand layout="inline" onNavigate={onClose} />
					<AppNavigation onNavigate={onClose} />
				</nav>
			) : null}
		</div>
	);
}
