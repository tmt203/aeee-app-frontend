<script lang="ts">
	import DefaultPageLayout from "@components/shared/templates/DefaultPageLayout.svelte";
	import type { PageData } from "./$types";
	import { parseToFormat } from "@utils/time";
	import { ArticleItem } from "@components/shared/molecules";
	import type { ArticleItemProps } from "@type/components/articleItem.type";
	import { mappingToArticleItem } from "@utils/components/article_item";
	import { WrapperContent } from "@components/shared/organisms";
	import { API_HOST } from "$lib/env/client";

	export let data: PageData;
	const { issue } = data;

	console.log("issue", issue);

	const articles: ArticleItemProps[] =
		issue?.articles.map((article) =>
			mappingToArticleItem({ article, showDoi: true, showPages: true, showViews: true })
		) || [];
</script>

<svelte:head>
	{#if issue}
		<title>
			Volume {issue.volume}, Issue {issue.issue} ({issue.year}) - AEEE
		</title>
		<meta
			name="description"
			content="Explore the articles in Volume {issue.volume}, Issue {issue.issue}."
		/>
	{:else}
		<title>Current Issues - AEEE</title>
		<meta name="description" content="Explore the current issues of the journal." />
	{/if}
</svelte:head>

<DefaultPageLayout
	showBanner={false}
	breadcrumbs={["Current Issues"]}
	tableOfContents={[
		{ id: "volume", title: "Volume & Issue" },
		{ id: "foreword", title: "Foreword" },
		{ id: "articles", title: "Articles" }
	]}
>
	{#if issue}
		<section class="flex w-full flex-col gap-4 text-surface-900/80 xl:w-9/12">
			<!-- Area: Volume & Issue -->
			<div id="volume" class="mb-6 border-b border-gray-200 pb-6">
				<h1 class=" text-4xl font-semibold tracking-tight">
					Volume {issue.volume}, Issue {issue.issue} ({issue.year})
				</h1>
				<p class="mt-1 text-lg italic">
					{parseToFormat(`${issue.month}`, "LLLL")}
				</p>
			</div>

			<!-- Area: Manager Section -->
			{#if issue.manager && issue.manager.avatar_url}
				<div id="foreword" class="card mb-6 flex flex-col items-start gap-6 p-4">
					<img
						src={`${API_HOST}${issue.manager.avatar_url}`}
						alt="Manager Avatar"
						class="h-40 w-auto border border-gray-200 object-cover shadow-sm"
					/>

					<div class="flex-1">
						<h5 class="mb-2 text-base font-semibold">{issue.manager.foreword}</h5>
						<p class="mb-3 whitespace-pre-line text-justify text-sm leading-relaxed">
							{issue.manager.foreword_content || ""}
						</p>
						<a
							target="_blank"
							href={`${API_HOST}${issue.manager.info_file_url}`}
							class="mt-2 inline-block text-sm font-medium text-primary-500 underline-offset-4 hover:text-primary-800 hover:underline"
						>
							Read more
						</a>
					</div>
				</div>
			{/if}

			<!-- Area: Articles Section -->
			<WrapperContent id="articles" leftLabel="Articles">
				<div class="flex flex-col gap-4">
					{#each articles as article}
						<ArticleItem {...article} />
					{/each}
				</div>
			</WrapperContent>
		</section>
	{:else}
		<p class="py-10 text-center text-gray-600">No current issues available.</p>
	{/if}
</DefaultPageLayout>
