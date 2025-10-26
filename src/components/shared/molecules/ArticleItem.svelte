<script lang="ts">
	import { API_HOST } from "$lib/env/client";
	import type { Citation } from "@type/api/article.type";
	import clsx from "clsx";
	import { t } from "svelte-i18n";

	export let id: string = "";
	export let doi: string = "";
	export let title: string = "";
	export let pdfPath: string = "";
	export let views: number = 0;
	export let lastPage: number = 0;
	export let firstPage: number = 0;
	export let authors: string[] = [];
	export let citations: Citation | null = null;
	export let showDoi: boolean = false;
	export let showPages: boolean = false;
	export let showViews: boolean = false;
	export let showButton: boolean = false;
	export let isEarlyAccess: boolean = false;
	export let onCiteArticle: (citations: Citation) => () => void = () => () => {};

	const link: string = isEarlyAccess
		? `${API_HOST}/${pdfPath}`
		: `/index.php/AEEE/article/view/${id}`;
</script>

<div
	{id}
	class="article-item flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition dark:border-gray-700 dark:bg-gray-900"
>
	<!-- Area: Authors -->
	<div class="mb-2 flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
		<i class="uil uil-user text-gray-500 dark:text-gray-400"></i>
		<span>{authors.join(", ")}</span>
	</div>

	<!-- Area: Title -->
	<h3 class="line-clamp-2 text-base font-semibold leading-snug text-gray-600 dark:text-gray-400">
		<a href={link} class="transition-colors duration-200 hover:text-blue-500" target="_blank">
			{title}
		</a>
	</h3>

	<!-- Area: DOI & Pages & Views -->
	{#if showDoi || showPages || showViews}
		<div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
			{#if showDoi && doi !== "Undefined"}
				<div class="variant-soft-success flex items-center gap-1 rounded-md px-2 py-1">
					<span class="font-medium">DOI:</span>
					<span>
						{doi}
					</span>
				</div>
			{/if}

			{#if showPages}
				<div
					class="variant-soft-primary flex items-center gap-1 rounded-md px-2 py-1 dark:border-gray-600"
				>
					<span class="font-medium">Pages:</span>
					<span>
						{firstPage && lastPage ? `${firstPage} – ${lastPage}` : $t("no_data")}
					</span>
				</div>
			{/if}

			{#if showViews}
				<div
					class="variant-soft-warning flex items-center gap-1 rounded-md px-2 py-1 dark:border-gray-600"
				>
					<span class="font-medium">Views:</span>
					<span>
						{views}
					</span>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Area: Buttons -->
	{#if showButton}
		<div
			class="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-700"
		>
			<a href={link} target="_blank" rel="noopener noreferrer">
				<button class="variant-filled-primary btn btn-sm">View full article</button>
			</a>
			{#if citations && onCiteArticle}
				<button class="variant-outline-primary btn btn-sm" on:click={onCiteArticle(citations)}>
					Cite this
				</button>
			{/if}
		</div>
	{/if}
</div>
