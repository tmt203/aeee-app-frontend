<script lang="ts">
	import { page } from "$app/stores";
	import type { SideBarItemsProps } from "@type/components/sidebar.type";
	import clsx from "clsx";
	import { t } from "svelte-i18n";

	export let sideBarItem: SideBarItemsProps;

	$: active = $page.url.pathname === sideBarItem.path;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class={clsx("sidebarItem relative my-1 w-full rounded-lg", $$props.class, {
		"bg-[linear-gradient(135deg,var(--tw-gradient-stops))] from-primary-500/[0.12] to-primary-500/[0.04] dark:from-primary-500/[0.24]":
			active,
		"transition-colors hover:bg-primary-500/10": !active
	})}
>
	{#if sideBarItem.onClick}
		<button
			type="button"
			class={clsx(
				"bg-initial flex w-full items-center space-x-2 px-2 py-2 text-start text-sm font-medium"
			)}
			on:click={sideBarItem.onClick}
		>
			<svelte:component
				this={sideBarItem.icon}
				class={clsx({ "stroke-primary-500": active, "stroke-secondary-text-color": !active })}
				size={16}
				strokeWidth={active ? 3 : 2.5}
			/>
			<div class="flex-1 text-sm text-inherit">
				{$t(sideBarItem.label)}
			</div>
		</button>
	{:else}
		<a
			href={sideBarItem.path}
			class={clsx(
				"bg-initial flex w-full items-center space-x-2 px-2 py-2 text-start text-sm font-medium"
			)}
		>
			<svelte:component
				this={sideBarItem.icon}
				class={clsx({ "stroke-primary-500": active, "stroke-secondary-text-color": !active })}
				size={16}
				strokeWidth={active ? 3 : 2.5}
			/>
			<div class="flex-1 text-sm text-inherit">
				{$t(sideBarItem.label)}
			</div>
		</a>
	{/if}
</div>
