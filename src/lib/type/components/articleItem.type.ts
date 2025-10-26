import type { Citation } from "@type/api/article.type";

export interface ArticleItemProps {
	id: string;
	authors: string[];
	title: string;
	pdfPath: string;
	views: number;
	doi: string;
	firstPage: number;
	lastPage: number;
	citations: Citation;
	showButton: boolean;
	showDoi: boolean;
	showPages: boolean;
	showViews: boolean;
	isEarlyAccess: boolean;
}
