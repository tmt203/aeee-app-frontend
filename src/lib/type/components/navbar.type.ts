import type { Icon } from "lucide-svelte";
import type { ComponentType } from "svelte";

export interface ToggleEvent {
	id: string;
	open: boolean;
	panelId: string;
	autocollapse: boolean;
	event?: Event;
}

export interface NavbarItemProps extends Omit<NavbarProps, "onToggle"> {
	children?: NavbarItemProps[];
}

export interface NavbarProps {
	group: string;
	label?: string;
	path?: string;
	icon?: ComponentType<Icon> | string;
	children?: NavbarItemProps[];
	subGroup?: string;
	role?: string;
	onClick?: () => {};
	onToggle?: (event: CustomEvent<ToggleEvent>) => void;
}

export interface NavbarGroupProps {
	group: string;
	items: NavbarProps[];
}
