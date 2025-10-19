<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import type { Link, TableOfContentsItem } from "@type/components/defaultPageLayout.type";
	import clsx from "clsx";

	export let showBanner: boolean = true;
	export let breadcrumbs: string[] = [];
	export let tableOfContents: TableOfContentsItem[] = [];

	const SIDEBAR_LINKS: Link[] = [
		{ label: "University", href: "https://www.vsb.cz/en/university/" },
		{ label: "Partnership", href: "https://www.vsb.cz/en/partnership/" },
		{ label: "Media and University", href: "https://www.vsb.cz/en/media/" },
		{ label: "Alumni Network", href: "https://alumni.vsb.cz/en/" },
		{
			label: "Study at VSB - Technical University of Ostrava",
			href: "https://www.vsb.cz/en/study/"
		}
	];

	let selectedId = tableOfContents.length > 0 ? tableOfContents[0].id : "";
	let isManualScrolling = false;

	/**
	 * Scroll to section
	 * @param id string
	 */
	const scrollToSection = (id: string) => {
		const target = document.getElementById(id);
		if (!target) return;

		const offset = 0; // header height
		const top = target.getBoundingClientRect().top + window.scrollY - offset;

		isManualScrolling = true; // block manual scroll event listener
		selectedId = id;
		history.replaceState(null, "", `#${id}`);

		window.scrollTo({
			top,
			behavior: "smooth"
		});

		// unblock manual scroll after 800ms
		setTimeout(() => {
			isManualScrolling = false;
		}, 800);
	};

	/**
	 * Handle scroll
	 */
	const handleScroll = () => {
		if (isManualScrolling) return; // block when manual scrolling
		const scrollPosition = window.scrollY + 120;

		for (const item of tableOfContents) {
			const section = document.getElementById(item.id);
			if (section) {
				const sectionTop = section.offsetTop;
				const sectionHeight = section.offsetHeight;

				if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
					if (selectedId !== item.id) {
						selectedId = item.id;
						history.replaceState(null, "", `#${selectedId}`);
					}
					break;
				}
			}
		}
	};

	onMount(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	});
</script>

<!-- Area: Breadcrumb -->
<div
	class="container flex w-full flex-col items-center justify-between bg-primary-500 px-4 py-3 text-white xl:flex-row xl:px-20"
>
	<span class="mr-auto">{breadcrumbs.join(" / ")}</span>
</div>

<!-- Area: Page Layout -->
<div
	class="container relative flex w-full flex-col gap-4 bg-white px-4 py-8 xl:flex-row xl:justify-between xl:px-20"
>
	<slot />

	<!-- Area: Sidebar -->
	<div
		class="sticky right-4 top-8 flex h-fit w-full flex-col gap-4 bg-transparent text-surface-700 xl:right-20 xl:w-3/12"
	>
		{#if tableOfContents.length > 0}
			<div class="card !bg-slate-100 p-4 shadow-md">
				<h4 class="mb-3 text-lg font-bold">Table of Contents</h4>
				<ul class="list-none space-y-1">
					{#each tableOfContents as item, index}
						<li>
							<button
								on:click={() => scrollToSection(item.id)}
								class={clsx(
									"w-full rounded-md px-2 py-1 text-left text-sm transition-colors duration-150 hover:bg-primary-50 hover:text-primary-600",
									selectedId === item.id ? "bg-primary-100 font-medium text-primary-600" : ""
								)}
							>
								{index + 1}. {item.title}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Area: Banner -->
		{#if showBanner}
			<div class="card !bg-slate-100 p-4 shadow-md">
				<h4 class="mb-2 text-lg font-bold">VSB-TUO</h4>
				<ul class="list-disc space-y-1 pl-4 text-sm">
					{#each SIDEBAR_LINKS as { label, href }}
						<li>
							<a {href} class="transition-colors duration-150 hover:text-primary-600">{label}</a>
						</li>
					{/each}
				</ul>
				<img src="/images/vsb-tuo-logo.png" alt="VSB TUO Logo" class="mt-4 w-full object-contain" />
			</div>
		{/if}
	</div>
</div>
