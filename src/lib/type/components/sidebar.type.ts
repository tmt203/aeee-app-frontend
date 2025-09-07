import type { Icon } from "lucide-svelte";
import type { ComponentType } from "svelte";

export interface ToggleEvent {
	id: string;
	open: boolean;
	panelId: string;
	autocollapse: boolean;
	event?: Event;
}

export interface SideBarItemsProps extends Omit<SideBarProps, "onToggle"> {
	children?: SideBarItemsProps[];
}

export interface SideBarProps {
	icon: ComponentType<Icon>;
	group: string;
	label: string;
	path?: string;
	children?: SideBarItemsProps[];
	subGroup?: string;
	role?: string;
	onClick?: () => void;
	onToggle?: (event: CustomEvent<ToggleEvent>) => void;
}

export interface SideBarGroupProps {
	group: string;
	items: SideBarProps[];
}
