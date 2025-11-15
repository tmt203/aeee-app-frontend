import * as icons from "@constants/icon.constants";
import type { Icon } from "lucide-svelte";
import type { ComponentType } from "svelte";

export enum Icons {
	"custom-info-icon" = `${icons.CUSTOM_INFO_ICON}`,
	"custom-danger-icon" = `${icons.CUSTOM_DANGER_ICON}`,
	"custom-success-icon" = `${icons.CUSTOM_SUCCESS_ICON}`,
	"custom-warning-icon" = `${icons.CUSTOM_WARNING_ICON}`
}

export interface RowActionIconData {
	label: string;
	icon?: ComponentType<Icon>;
	color?: string;
	disabled?: boolean;
	onClick: () => void;
}
