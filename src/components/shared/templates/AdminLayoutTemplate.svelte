<script lang="ts">
	import { page } from "$app/stores";
	import { SIDEBAR } from "@constants/sidebar.constants";
	import {
		getDrawerStore,
		modeOsPrefers,
		setModeCurrent,
		type DrawerSettings
	} from "@skeletonlabs/skeleton";
	import { sidebarExpanded } from "@store/sidebar";
	import type { SideBarGroupProps } from "@type/components/sidebar.type";
	import clsx from "clsx";
	import { onMount } from "svelte";
	import { Sidebar } from "../molecules";

	const drawerStore = getDrawerStore();

	let subGroupId: string = "";
	let currentGroup: string = "";
	let previousPath: string = "";
	let logo: string = "/images/logo.png";
	let expanded: boolean = $sidebarExpanded;
	let sideBar: SideBarGroupProps[] = SIDEBAR;
	let asideElement: HTMLElement | null = null;
	let mouseEnterTimeout: ReturnType<typeof setTimeout> | null = null;

	/**
	 * Handle sidebar toggle
	 */
	const handleSidebarToggle = () => {
		if (innerWidth > 430) {
			// Desktop
			sidebarExpanded.update((current) => !current);
			expanded = !expanded;
		} else {
			// Mobile
			if ($drawerStore.open) {
				drawerStore.close();
				return;
			}

			const drawerSettings: DrawerSettings = {
				id: "mobile-sidebar",
				bgBackdrop: "bg-surface-900/50 dark:bg-surface-100/50",
				width: "w-2/3"
			};

			drawerStore.open(drawerSettings);
		}
	};

	/**
	 * Handle mouse enter
	 */
	const handleMouseEnter = () => {
		if (!$sidebarExpanded) {
			mouseEnterTimeout = setTimeout(() => {
				expanded = true;
			}, 150);
		}
	};

	/**
	 * Handle mouse leave
	 */
	const handleMouseLeave = () => {
		if (mouseEnterTimeout) {
			clearTimeout(mouseEnterTimeout);
			mouseEnterTimeout = null;
		}
		if (!$sidebarExpanded) {
			expanded = false;
		}
	};

	// Reactivity to update sidebar selected item based on current path
	$: if ($page.url.pathname && $page.url.pathname !== previousPath) {
		currentGroup = $page.url.pathname.split("/").filter(Boolean)[0];
		subGroupId = $page.url.pathname.split("/").filter(Boolean)[1];
		previousPath = $page.url.pathname;
	}

	/**
	 * Run as soon as the component has been mounted to the DOM.
	 */
	onMount(() => {
		// Set os mode as default for (default) layout
		setModeCurrent($modeOsPrefers);
	});
</script>

<section class="admin-layout-template text-surface-900/80 dark:text-surface-600">
	<aside
		bind:this={asideElement}
		class={clsx(
			"fixed left-0 z-[99] hidden h-screen transition-all duration-300 ease-in-out md:block",
			{
				"w-64": $sidebarExpanded,
				"w-20 hover:w-64 hover:shadow-2xl": !$sidebarExpanded
			}
		)}
		on:mouseenter={handleMouseEnter}
		on:mouseleave={handleMouseLeave}
	>
		<Sidebar
			{sideBar}
			{logo}
			bind:expanded
			bind:currentGroup
			bind:subGroupId
			onSidebarToggle={handleSidebarToggle}
		/>
	</aside>

	<main
		class={clsx(
			"flex min-h-screen w-full flex-col justify-between bg-gray-100 pl-0 text-surface-900/80 dark:bg-gray-900 dark:text-surface-600",
			{
				"md:pl-64": $sidebarExpanded,
				"md:pl-20": !$sidebarExpanded
			}
		)}
	>
		<div class="h-screen md:pl-2">
			<slot />
		</div>
	</main>
</section>
