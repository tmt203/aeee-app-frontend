import type { Article } from "@type/api/article.type";
import type { ArticleItemProps } from "@type/components/articleItem.type";
import { toCapitalCase } from "@utils/string";

/**
 * Mapping Article to ArticleItemProps
 * @param article Article
 * @param showButton boolean
 * @returns ArticleItemProps
 */
export const mappingToArticleItem = ({
	article,
	showButton = false,
	showViews = false,
	showDoi = false,
	showPages = false,
	isEarlyAccess = false
}: {
	article: Article;
	showButton?: boolean;
	showViews?: boolean;
	showDoi?: boolean;
	showPages?: boolean;
	isEarlyAccess?: boolean;
}): ArticleItemProps => {
	const authors = article.authors.map((author) =>
		`${author.first_name} ${toCapitalCase(author.last_name)}`.replace("-", " ")
	);

	return {
		id: `${article.id}`,
		title: article.title,
		views: article.views,
		doi: article.doi,
		pdfPath: article.pdf_path || "",
		firstPage: article?.pages?.first || 0,
		lastPage: article?.pages?.last || 0,
		citations: article.citations,
		authors,
		showButton,
		showDoi,
		showPages,
		showViews,
		isEarlyAccess
	};
};
