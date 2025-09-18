<script lang="ts">
	import { getDrawerStore, modeCurrent } from "@skeletonlabs/skeleton";
	import { sidebarExpanded } from "@store/sidebar";
	import type { SideBarGroupProps } from "@type/components/sidebar.type";
	import clsx from "clsx";
	import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-svelte";
	import { t } from "svelte-i18n";
	import { Icon, NavProfile, Profile } from "../atoms";
	import { SidebarMenu } from ".";

	export let logo: string = "/logo/pitel-logo.jpeg";
	export let currentGroup: string = "";
	export let subGroupId: string = "";
	export let expanded: boolean;
	export let sideBar: SideBarGroupProps[];
	export let sidebarType: "mobile" | "desktop" = "desktop";
	export let onSidebarToggle: () => void;

	/**
	 * Handle close mobile sidebar
	 */
	const handleCloseMobileSidebar = () => {
		getDrawerStore().close();
	};

	// Reactivity to update currentGroup when subGroupId is valid
	// $: if (subGroupId) {
	// 	sideBar.map(({ group, items }) => {
	// 		items.map((item) => {
	// 			const { children } = item;
	// 			if (children) {
	// 				const isChildActive = children.some((item) => item.subGroup === subGroupId);
	// 				if (isChildActive) {
	// 					currentGroup = item.group;
	// 				}
	// 			}
	// 		});
	// 	});
	// }
</script>

{#if sidebarType === "desktop"}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="bg-surface-50-900-token absolute flex h-screen w-full flex-col justify-between border-r border-surface-600 p-2 shadow-lg"
	>
		<div class={clsx("flex flex-col", { "items-center": !expanded && !$sidebarExpanded })}>
			<!-- Area: Nav Profile -->
			<NavProfile {expanded} {logo} />

			<!-- Area: Profile -->
			<Profile {expanded} />

			<!-- Area: Sidebar Menu -->
			<SidebarMenu {sideBar} {expanded} bind:currentGroup bind:subGroupId />
		</div>

		<!-- Area: Sidebar Toggle Button -->
		<button
			class={clsx(
				"text-surface-900-50-token flex w-full items-center gap-4 rounded-xl transition-colors duration-300 hover:bg-surface-500 dark:hover:bg-surface-50/10",
				{ "justify-center": !expanded && !$sidebarExpanded, "px-3": expanded || $sidebarExpanded }
			)}
			on:click={onSidebarToggle}
		>
			{#if $sidebarExpanded}
				<ArrowLeftFromLine color={$modeCurrent ? "black" : "gray"} size={16} />
			{:else}
				<ArrowRightFromLine color={$modeCurrent ? "black" : "gray"} size={16} />
			{/if}
			<span class={clsx("text-sm", { hidden: !expanded && !$sidebarExpanded })}>
				{$t(`sidebar.${$sidebarExpanded ? "collapse" : "expand"}`)}
			</span>
		</button>
	</div>
{:else}
	<div class="flex h-screen flex-col justify-between py-4 dark:bg-surface-900">
		<div class="flex flex-col gap-4">
			<div class="flex w-full justify-end px-4">
				<Icon icon="uil uil-multiply" onClick={handleCloseMobileSidebar} />
			</div>

			<div class="mb-10 flex w-full justify-center">
				<img class="h-16" src={logo} alt="img" loading="lazy" />
			</div>

			<SidebarMenu {sideBar} {expanded} bind:currentGroup bind:subGroupId />
		</div>
	</div>
{/if}
