<script lang="ts">
	import { getDrawerStore, modeCurrent } from "@skeletonlabs/skeleton";
	import { sidebarExpanded } from "@store/sidebar";
	import type { SideBarGroupProps } from "@type/components/sidebar.type";
	import clsx from "clsx";
	import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-svelte";
	import { t } from "svelte-i18n";
	import { Icon, NavProfile, Profile } from "../atoms";
	import { SidebarMenu } from ".";

	export let logo: string = "/logo/logo-pitel.png";
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
	$: if (subGroupId) {
		sideBar.map(({ group, items }) => {
			items.map((item) => {
				const { children } = item;
				if (children) {
					const isChildActive = children.some((item) => item.subGroup === subGroupId);
					if (isChildActive) {
						currentGroup = item.group;
					}
				}
			});
		});
	}
</script>

{#if sidebarType === "desktop"}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="absolute flex h-screen w-full flex-col justify-between bg-white p-2 dark:bg-gray-800">
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
				"flex w-full items-center gap-2 rounded-lg transition-colors hover:bg-primary-500/10",
				{ "justify-center": !expanded && !$sidebarExpanded, "px-3": expanded || $sidebarExpanded }
			)}
			on:click={onSidebarToggle}
		>
			{#if $sidebarExpanded}
				<ArrowLeftFromLine class="stroke-secondary-text-color" strokeWidth={2.5} size={16} />
			{:else}
				<ArrowRightFromLine class="stroke-secondary-text-color" strokeWidth={2.5} size={16} />
			{/if}
			<span class={clsx("text-sm font-medium", { hidden: !expanded && !$sidebarExpanded })}>
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

		<div class="mx-3 flex items-center justify-center dark:!bg-surface-900">
			<small>
				©{new Date().getFullYear()}
				<a target="_blank" href="https://trantri.site" class="text-link-text-color">Tran Minh Tri</a
				>
			</small>
		</div>
	</div>
{/if}
