import type { AuditInfo, Param } from "@type/common.type";

export type PublishStatus = "received" | "revised" | "accepted" | "published";

export type PubDate = {
	year: number;
	month: number;
	day: number;
};

export type History = {
	status: PublishStatus;
} & PubDate;

export type Author = {
    first_name: string;
    last_name: string;
}

export type ArticleQueryParams = {
	title?: string;
	doi_contains?: string;
	volume?: number;
	issue?: number;
	authors?: Author[];
	pub_date?: PubDate;
	year?: number;
	sort?: string;
} & Param;

export type Article = {
	title: string;
	doi: string;
	volume: number;
	issue: number;
	authors: Author[];
	pages: {
		first: number;
		last: number;
	};
	history: History[];
	abstract: string;
	language: string;
	pdf_path: string;
	category: string;
	views: number;
	year: number;
} & AuditInfo;
