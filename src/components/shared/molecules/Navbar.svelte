<script lang="ts">
	import type { NavbarGroupProps } from "@type/components/navbar.type";
	import { Motion } from "svelte-motion";
	import Button from "./Button.svelte";

	export let items: NavbarGroupProps[] = [];

	let hoveredIndex: number | null = null;
	let mobileOpen = false;
	let mobileDropdownIndex: number | null = null;

	/**
	 * Toggle mobile nav
	 */
	const toggleMobileNav = () => {
		mobileOpen = !mobileOpen;
		mobileDropdownIndex = null;
	};

	/**
	 * Toggle mobile dropdown
	 * @param index number
	 */
	const toggleMobileDropdown = (index: number) => {
		mobileDropdownIndex = mobileDropdownIndex === index ? null : index;
	};
</script>

<header
	class="container flex flex-col items-center justify-between bg-white px-4 py-8 text-surface-700 xl:flex-row xl:px-20"
>
	<!-- Area: Logo -->
	<img src="images/logo.png" alt="AEEE Logo" class="h-auto w-auto xl:h-6" />

	<!-- Area: Links (Desktop) -->
	<nav class="hidden flex-col items-center xl:flex xl:flex-row">
		<ul class="float-left w-full list-none text-center">
			{#each items[0].items as item, i}
				<div
					class="relative float-left w-auto"
					on:mouseenter={() => (hoveredIndex = i)}
					on:mouseleave={() => (hoveredIndex = null)}
					style="display: inline-block;"
					role="menuitem"
					tabindex="0"
				>
					<li class="list-none">
						<a
							href={item.path}
							class={`relative block cursor-pointer rounded-md border border-transparent px-4 py-3 capitalize transition-all duration-300 ease-in-out
        hover:border-surface-400 hover:text-blue-500
        ${item.children && hoveredIndex === i ? "border-surface-400 text-blue-500" : ""}`}
						>
							{#if item.icon}
								<i class={`${item.icon}`}></i>
							{/if}
							{item.label ?? ""}
							{#if item.children}
								<i class="uil uil-angle-down"></i>
							{/if}
						</a>
					</li>

					<!-- Area: Dropdown Menu -->
					{#if item.children && hoveredIndex === i}
						<Motion
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.3 }}
							let:motion
						>
							<ul
								use:motion
								class="absolute left-0 top-full z-50 min-w-[200px] rounded-md bg-white shadow-lg"
							>
								{#each item.children as child}
									<li>
										<a
											href={child.path}
											class="block rounded px-4 py-2 text-left capitalize text-surface-700 hover:bg-surface-100 hover:text-blue-500"
										>
											{child.label}
										</a>
									</li>
								{/each}
							</ul>
						</Motion>
					{/if}
				</div>
			{/each}
		</ul>

		<!-- Area: Submit Button -->
		<Button
			label="Submit your article"
			variant="secondary"
			class="ml-4"
			on:click={() => window.open("https://aeee.manuscriptmanager.net/aeee", "_blank", "noopener")}
		/>
	</nav>

	<!-- Area: Links (Mobile) -->
	<div class="relative mt-4 flex w-full items-center justify-between xl:hidden">
		<button on:click={toggleMobileNav}>
			<i class="uil uil-bars cursor-pointer text-2xl"></i>
		</button>

		<Button
			label="Submit your article"
			variant="secondary"
			class="w-40"
			size="sm"
			on:click={() => window.open("https://aeee.manuscriptmanager.net/aeee", "_blank", "noopener")}
		/>

		{#if mobileOpen}
			<Motion
				initial={{ opacity: 0, y: -40 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -40 }}
				transition={{ duration: 0.3 }}
				let:motion
			>
				<ul
					use:motion
					class="absolute left-0 top-full z-50 w-full rounded-md bg-white p-4 shadow-lg"
				>
					{#each items[0].items as item, i}
						<li class="mb-2">
							<div class="flex items-center justify-between">
								<a
									href={item.path}
									class="flex w-full rounded px-4 py-2 capitalize text-surface-700 hover:bg-surface-100 hover:text-blue-500"
									on:click={() => {
										if (!item.children) mobileOpen = false;
										if (item.children) toggleMobileDropdown(i);
									}}
								>
									{#if item.icon}
										<i class={`${item.icon}`}></i>
									{/if}
									{item.label ?? ""}
									{#if item.children}
										<i class="uil uil-angle-down ml-auto"></i>
									{/if}
								</a>
							</div>
							{#if item.children && mobileDropdownIndex === i}
								<Motion
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.3 }}
									let:motion
								>
									<ul use:motion class="mt-2 pl-6">
										{#each item.children as child}
											<li>
												<a
													href={child.path}
													class="block rounded px-4 py-2 capitalize text-surface-700 hover:bg-surface-100 hover:text-blue-500"
													on:click={() => (mobileOpen = false)}
												>
													{child.label}
												</a>
											</li>
										{/each}
									</ul>
								</Motion>
							{/if}
						</li>
					{/each}
				</ul>
			</Motion>
		{/if}
	</div>
</header>
