import type { Citation } from "@type/api/article.type";

export interface ArticleItemProps {
	id: string;
	authors: string[];
	title: string;
	link: string;
	views: number;
	citations: Citation;
	showButton: boolean;
}
