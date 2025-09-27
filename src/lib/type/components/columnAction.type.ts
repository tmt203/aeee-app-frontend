import type { Icon } from "lucide-svelte";
import type { ComponentType } from "svelte";

export interface FilterItem {
	label: string;
	icon: ComponentType<Icon>;
}
