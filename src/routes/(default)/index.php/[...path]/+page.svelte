<script lang="ts">
	import DetailArticlePage from "@components/shared/pages/detail-article-page/DetailArticlePage.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;

	const { article } = data;
</script>

<svelte:head>
	<title>AEEE - {article?.title}</title>
	<meta name="description" content="Abstracting and indexing of the journal." />
</svelte:head>

<DetailArticlePage {article} />
