<script lang="ts">
	import { DefaultPageLayout } from "@components/shared/templates";
	import { parseToFormat } from "@utils/time";
	import type { PageData } from "./$types";

	export let data: PageData;

	const { page } = data;
</script>

<svelte:head>
	<title>Publication Frequency - AEEE</title>
	<meta name="description" content="Publication frequency of the journal." />
</svelte:head>

<DefaultPageLayout breadcrumbs={["About Us", "Publication Frequency"]}>
	{#if page}
		<div class="flex w-full flex-col gap-4 xl:w-9/12">
			<!-- Area: Article -->
			<article class="aeee-article">
				{@html page.content}
			</article>

			<!-- Area: Last Update -->
			<div class="flex w-full justify-end text-sm text-gray-600 dark:text-gray-400">
				<span>
					Last updated: {parseToFormat(page.updated_at, "yyyy/MM/dd HH:mm:ss")}
				</span>
			</div>
		</div>
	{:else}
		<p>There is no content yet...</p>
	{/if}
</DefaultPageLayout>
