import * as icons from "@constants/icon.constants";
import type { Icon } from "lucide-svelte";
import type { ComponentType } from "svelte";

export enum Icons {
	"display-more-icon" = `${icons.DISPLAY_MORE_ICON}`
}

export interface RowActionIconData {
	label: string;
	icon?: ComponentType<Icon>;
	color?: string;
	disabled?: boolean;
	onClick: () => void;
}
