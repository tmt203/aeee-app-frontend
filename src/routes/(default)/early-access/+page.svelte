<script lang="ts">
	import { PUBLIC_API_HOST } from "$lib/env/client";
	import ArticleItem from "@components/shared/molecules/ArticleItem.svelte";
	import { DefaultPageLayout } from "@components/shared/templates";
	import { mappingToArticleItem } from "@utils/components/article_item";
	import type { PageData } from "./$types";

	export let data: PageData;

	const { articles } = data;

	const earlyAccessArticles = articles.map((article) =>
		mappingToArticleItem(article, false, false)
	);
</script>

<svelte:head>
	<title>AEEE - Early Access</title>
	<meta name="description" content="Early access articles." />
</svelte:head>

<DefaultPageLayout breadcrumbs={["Early Access"]}>
	<div class="flex flex-col gap-4">
		{#each earlyAccessArticles as item}
			<ArticleItem {...item} link={`${PUBLIC_API_HOST}${item.link}`} />
		{/each}
	</div>
</DefaultPageLayout>
