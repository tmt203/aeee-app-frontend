<script lang="ts">
	import DefaultMainPage from "@components/shared/pages/default-main-page/DefaultMainPage.svelte";
	import type { PageData } from "./$types";
	import type { Article } from "@type/api/article.type";
	import type { ArticleItemProps } from "@type/components/articleItem.type";
	import { toCapitalCase, normalizeTitle } from "@utils/string";

	export let data: PageData;

	const { mostViewsArticles, previousArticles, incomingArticles } = data;

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
	mostViewsArticles={mappedMostViewsArticles}
	previousArticles={mappedPreviousArticles}
	incomingArticles={mappedIncomingArticles}
/>
