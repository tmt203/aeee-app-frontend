<script lang="ts">
	import DetailArticlePage from "@components/shared/pages/detail-article-page/DetailArticlePage.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;

	const { article } = data;
</script>

<svelte:head>
	<title>{article?.title}</title>
	<meta name="description" content={article.abstract} />
</svelte:head>

<DetailArticlePage {article} />
