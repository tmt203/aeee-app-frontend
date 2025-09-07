<script lang="ts">
	import { SIDEBAR } from "@constants/sidebar.constants";
	import { getDrawerStore, type DrawerSettings } from "@skeletonlabs/skeleton";
	import { sidebarExpanded } from "@store/sidebar";
	import type { SideBarGroupProps } from "@type/components/sidebar.type";
	import clsx from "clsx";
	import { Sidebar } from "../molecules";

	const drawerStore = getDrawerStore();

	let sideBar: SideBarGroupProps[] = SIDEBAR;
	let asideElement: HTMLElement | null = null;
	let mouseEnterTimeout: ReturnType<typeof setTimeout> | null = null;
	let logo: string = "/images/logo.png";
	let subGroupId: string = "";
	let currentGroup: string = "";
	let expanded: boolean = $sidebarExpanded;

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
</script>

<section class="admin-layout-template">
	<aside
		bind:this={asideElement}
		class={clsx(
			"fixed left-0 z-[99] hidden h-screen transition-all duration-300 ease-in-out md:block",
			{
				"w-12 hover:w-72": !$sidebarExpanded,
				"w-72": $sidebarExpanded
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
			"bg-surface-50-900-token flex min-h-screen w-full flex-1 flex-col justify-between pl-0 text-surface-800 dark:text-surface-600",
			{
				"md:pl-72": $sidebarExpanded,
				"md:pl-12": !$sidebarExpanded
			}
		)}
	>
		<div class="h-fit rounded-xl">
			<slot />
		</div>

		<!-- Area: Footer -->
		<footer class="mx-3 flex items-center justify-end !bg-transparent">
			<small>
				©{new Date().getFullYear()}
				<a target="_blank" href="https://pitel.vn/" class="text-primary-500">PITEL.VN</a>
			</small>
		</footer>
	</main>
</section>
