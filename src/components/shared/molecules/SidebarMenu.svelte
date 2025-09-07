<script lang="ts">
	import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";
	import { sidebarExpanded } from "@store/sidebar";
	import type { SideBarGroupProps } from "@type/components/sidebar.type";
	import clsx from "clsx";
	import { t } from "svelte-i18n";
	import { SidebarItem } from "../atoms";

	export let currentGroup: string;
	export let subGroupId: string = "";
	export let sideBar: SideBarGroupProps[];
	export let expanded: boolean;

	let open: boolean = !!sideBar
		.flatMap((item) => item.items)
		.find((item) => item.group === currentGroup)?.children?.length;
</script>

<div
	class={clsx(
		"mt-3 flex w-full flex-col overflow-y-auto max-[375px]:max-h-[440px] dark:bg-surface-900"
	)}
>
	{#each sideBar as { group, items }}
		{#if group.length}
			{#if expanded || $sidebarExpanded}
				<span class="my-1 text-xs font-semibold uppercase text-surface-700">{$t(group)}</span>
			{:else}
				<hr class="my-3 h-[1px] w-full border !border-b-surface-700" />
			{/if}
		{/if}

		{#each items as sideBarItem}
			{#if !expanded && !$sidebarExpanded}
				<div
					class={clsx(
						"my-[6px] flex size-full cursor-pointer items-center justify-center self-center rounded-lg px-1 py-1",
						{
							"bg-surface-500 shadow-sm dark:bg-surface-50/10": sideBarItem.group === currentGroup,
							"bg-surface-50-900-token transition-colors duration-300 hover:bg-surface-500 dark:hover:bg-surface-50/10":
								sideBarItem.group !== currentGroup
						}
					)}
				>
					<svelte:component this={sideBarItem.icon} color="#aaaeb4" size={16} />
				</div>
			{:else if sideBarItem.children && sideBarItem.children.length}
				<!-- Sidebar Sub Children Menu -->
				<Accordion
					width="my-1"
					transitionInParams={{ duration: 300 }}
					transitionOutParams={{ duration: 300 }}
					padding="px-2"
					regionControl="text-xs !py-2 !space-x-2 transition-colors duration-300 hover:!bg-surface-500 dark:hover:!bg-surface-50/10"
					regionPanel="space-y-2 py-1 !p-0 [&_.sidebarItem]:pl-4"
				>
					<AccordionItem bind:open rounded="rounded-lg">
						<svelte:fragment slot="lead">
							<svelte:component this={sideBarItem.icon} color="#aaaeb4" size={16} />
						</svelte:fragment>
						<svelte:fragment slot="summary">
							{#if expanded || $sidebarExpanded}
								{$t(sideBarItem.label)}
							{/if}
						</svelte:fragment>
						<svelte:fragment slot="content">
							{#each sideBarItem.children as child}
								<SidebarItem
									sideBarItem={child}
									active={child.subGroup === subGroupId}
									bind:subGroupId
									bind:currentGroup
								/>
							{/each}
						</svelte:fragment>
					</AccordionItem>
				</Accordion>
			{:else}
				<!-- Sidebar Sub Menu Item -->
				<SidebarItem
					{sideBarItem}
					active={!sideBarItem.children && sideBarItem.group === currentGroup}
					bind:subGroupId
					bind:currentGroup
				/>
			{/if}
		{/each}
	{/each}
</div>
