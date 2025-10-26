<script lang="ts">
	import ArticleItem from "@components/shared/molecules/ArticleItem.svelte";
	import { DefaultPageLayout } from "@components/shared/templates";
	import { mappingToArticleItem } from "@utils/components/article_item";
	import type { PageData } from "./$types";

	export let data: PageData;

	const { articles } = data;

	const earlyAccessArticles = articles.map((article) =>
		mappingToArticleItem({ article, isEarlyAccess: true })
	);
</script>

<svelte:head>
	<title>Early Access - AEEE</title>
	<meta name="description" content="Early access articles." />
</svelte:head>

<DefaultPageLayout breadcrumbs={["Early Access"]}>
	<div class="flex w-full flex-col gap-4 xl:w-9/12">
		{#each earlyAccessArticles as item}
			<ArticleItem {...item} />
		{/each}
	</div>
</DefaultPageLayout>
