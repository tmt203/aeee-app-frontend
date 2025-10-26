<script lang="ts">
	import DefaultMainPage from "@components/shared/pages/default-main-page/DefaultMainPage.svelte";
	import type { ArticleItemProps } from "@type/components/articleItem.type";
	import { mappingToArticleItem } from "@utils/components/article_item";
	import type { PageData } from "./$types";

	export let data: PageData;

	const { latestManager, mostViewsArticles, previousArticles, incomingArticles } = data;

	const latestManagerForeword = latestManager
		? latestManager.foreword
		: "Welcome to the Advances in Electrical and Electronic Engineering journal. We are dedicated to publishing high-quality research articles that contribute to the advancement of knowledge in the field of electrical and electronic engineering. Our journal provides a platform for researchers, academics, and industry professionals to share their findings and insights with a global audience. We invite you to explore our latest articles and join us in our mission to promote innovation and excellence in this dynamic field.";
	const mappedMostViewsArticles: ArticleItemProps[] = mostViewsArticles.map((article) =>
		mappingToArticleItem({ article, showViews: true })
	);
	const mappedPreviousArticles: ArticleItemProps[] = previousArticles.map((article) =>
		mappingToArticleItem({ article, showViews: true })
	);
	const mappedIncomingArticles: ArticleItemProps[] = incomingArticles.map((article) =>
		mappingToArticleItem({ article, showViews: true })
	);
</script>

<svelte:head>
	<title>Advances in Electrical and Electronic Engineering</title>
	<meta
		name="description"
		content="Explore the latest research articles in electrical and electronic engineering."
	/>
</svelte:head>

<DefaultMainPage
	{latestManagerForeword}
	mostViewsArticles={mappedMostViewsArticles}
	previousArticles={mappedPreviousArticles}
	incomingArticles={mappedIncomingArticles}
/>
