<script lang="ts">
	import { goto } from "$app/navigation";
	import { getDrawerStore } from "@skeletonlabs/skeleton";
	import type { SideBarItemsProps } from "@type/components/sidebar.type";
	import clsx from "clsx";
	import { t } from "svelte-i18n";

	export let sideBarItem: SideBarItemsProps;
	export let currentGroup: string = "";
	export let subGroupId: string = "";
	export let active: boolean = false;

	const drawerStore = getDrawerStore();

	/**
	 * Handle sub sidebar item click
	 */
	const handleSubItemClick = () => {
		if (sideBarItem.onClick) {
			sideBarItem.onClick();
		}

		if (sideBarItem.path?.length) {
			currentGroup = sideBarItem.group;
			subGroupId = sideBarItem.subGroup || "";
			goto(sideBarItem.path || "/");

			if ($drawerStore.open) {
				drawerStore.close();
			}
		}
	};
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class={clsx("sidebarItem relative my-1 w-full rounded-lg", $$props.class, {
		"bg-surface-500 dark:bg-surface-50/10": active,
		"transition-colors duration-300 hover:bg-surface-500 dark:hover:bg-surface-50/10": !active
	})}
>
	<button
		type="button"
		class={clsx("bg-initial flex w-full items-center space-x-2 px-2 py-2 text-start text-sm", {
			"font-semibold": active,
			"text-surface-900": !active
		})}
		on:click={handleSubItemClick}
	>
		<svelte:component
			this={sideBarItem.icon}
			color={active ? "#1075BA" : "#aaaeb4"}
			size={16}
			strokeWidth={active ? 3 : 2}
		/>
		<div class="flex-1 text-xs dark:text-surface-300">
			{$t(sideBarItem.label)}
		</div>
	</button>
</div>
