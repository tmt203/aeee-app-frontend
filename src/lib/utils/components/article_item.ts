import type { Article } from "@type/api/article.type";
import type { ArticleItemProps } from "@type/components/articleItem.type";
import { toCapitalCase } from "@utils/string";
import title from "title";

/**
 * Mapping Article to ArticleItemProps
 * @param article Article
 * @param showButton boolean
 * @returns ArticleItemProps
 */
export const mappingToArticleItem = (article: Article, showButton: boolean, showViews: boolean): ArticleItemProps => {
	return {
		id: article.id,
		authors: article.authors.map((author) =>
			`${author.first_name} ${toCapitalCase(author.last_name)}`.replace("-", " ")
		),
		title: title(article.title),
		link: article.pdf_path,
		views: article.views,
		citations: article.citations,
		showButton,
        showViews
	};
};
