<script lang="ts">
	import { DefaultPageLayout } from "@components/shared/templates";
	import { parseToFormat } from "@utils/time";
	import type { PageData } from "./$types";
	import { UserRound } from "lucide-svelte";

	export let data: PageData;

	const { announcements } = data;
</script>

<svelte:head>
	<title>Announcements - AEEE</title>
	<meta name="description" content="Announcements of the journal." />
</svelte:head>

<DefaultPageLayout breadcrumbs={["About Us", "Announcements"]}>
	{#if announcements && announcements.length > 0}
		<div class="flex w-full flex-col gap-4 xl:w-9/12">
			{#each announcements as announcement}
				<article class="aeee-article">
					<section class="flex items-center gap-2">
						<UserRound size={14} />
						<span class="text-sm">{announcement.author}</span>
					</section>
					<span class="text-4xl font-bold">{announcement.title}</span>
					<div>
						{@html announcement.content}
					</div>

					<!-- Area: Last Update -->
					<div class="flex w-full justify-end text-sm text-gray-600 dark:text-gray-400">
						<span>
							Last updated: {parseToFormat(announcement.updated_at, "yyyy/MM/dd HH:mm:ss")}
						</span>
					</div>
				</article>
			{/each}
		</div>
	{:else}
		<p>There is no content yet...</p>
	{/if}
</DefaultPageLayout>
