<script lang="ts">
	import DefaultMainPage from "@components/shared/pages/default-main-page/DefaultMainPage.svelte";
	import type { PageData } from "./$types";
	import type { Article } from "@type/api/article.type";
	import type { ArticleItemProps } from "@type/components/articleItem.type";
	import { toCapitalCase, normalizeTitle } from "@utils/string";

	export let data: PageData;

	const { latestManager, mostViewsArticles, previousArticles, incomingArticles } = data;

	/**
	 * Mapping Article to ArticleItemProps
	 * @param article Article
	 * @param showButton boolean
	 * @returns ArticleItemProps
	 */
	const mappingToArticleItem = (article: Article, showButton: boolean): ArticleItemProps => {
		return {
			id: article.id,
			authors: article.authors.map(
				(author) => `${author.first_name} ${toCapitalCase(author.last_name)}`
			),
			title: normalizeTitle(article.title),
			link: article.pdf_path,
			views: article.views,
			showButton
		};
	};

	const latestManagerForeword = latestManager
		? latestManager.foreword
		: "Welcome to the Advances in Electrical and Electronic Engineering journal. We are dedicated to publishing high-quality research articles that contribute to the advancement of knowledge in the field of electrical and electronic engineering. Our journal provides a platform for researchers, academics, and industry professionals to share their findings and insights with a global audience. We invite you to explore our latest articles and join us in our mission to promote innovation and excellence in this dynamic field.";
	const mappedMostViewsArticles: ArticleItemProps[] = mostViewsArticles.map((article) =>
		mappingToArticleItem(article, true)
	);
	const mappedPreviousArticles: ArticleItemProps[] = previousArticles.map((article) =>
		mappingToArticleItem(article, false)
	);
	const mappedIncomingArticles: ArticleItemProps[] = incomingArticles.map((article) =>
		mappingToArticleItem(article, false)
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
	{mappingToArticleItem}
/>
