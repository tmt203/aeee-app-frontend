<script lang="ts">
	import { getModalStore } from "@skeletonlabs/skeleton";
	import type { Citation } from "@type/api/article.type";
	import { Eye } from "lucide-svelte";

	export let authors: string[] = [];
	export let title: string = "";
	export let link: string = "";
	export let views: number = 0;
	export let showButton: boolean = false;
	export let onCiteArticle: () => void;
</script>

<div
	class="article-item flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition dark:border-gray-700 dark:bg-gray-900"
>
	<!-- Authors -->
	<div class="mb-2 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
		<i class="uil uil-user text-gray-500 dark:text-gray-400"></i>
		<span class="truncate">{authors.join(", ")}</span>
	</div>

	<!-- Title -->
	<h3 class="mb-2 line-clamp-2 text-base font-semibold leading-snug">
		<a
			href={link}
			class="transition-colors duration-200 hover:text-blue-500"
			target="_blank"
			rel="noopener noreferrer">{title}</a
		>
	</h3>

	<!-- Views -->
	<span class="text-xs text-gray-500">
		<Eye class="mr-1 inline-block" size={16} />
		{views} views
	</span>

	<!-- Buttons -->
	{#if showButton}
		<div
			class="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-700"
		>
			<a href={link} target="_blank" rel="noopener noreferrer">
				<button class="variant-filled-primary btn btn-sm">View full article</button>
			</a>
			<button class="variant-outline-primary btn btn-sm" on:click={onCiteArticle}>Cite this</button>
		</div>
	{/if}
</div>
