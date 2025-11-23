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
};

export type ArticleQueryParams = {
	title?: string;
	doi_contains?: string;
	volume?: number;
	issue?: number;
	authors?: Author[];
	pub_date?: PubDate;
	year?: number;
	sort?: string;
	active_eq?: boolean;
} & Param;

export type Citation = {
	apa: string;
	bib_tex: string;
};

export type ArticleBody = {
	_id: string; // MongoDB document ID (which extract from DOI, not use default generated ID)
	id: string; // MongoDB document ID (which extract from DOI, not use default generated ID)
	title: string;
	doi: string;
	volume: number;
	issue: number;
	authors: Author[];
	history: History[];
	abstract: string;
	language: string;
	pdf_path: string;
	category: string;
	views: number;
	year: number;
	citations: Citation;
	pub_date: PubDate;
	pages?: {
		first: number;
		last: number;
	};
	active: boolean;
};

export type Article = Omit<ArticleBody, "_id"> & Omit<AuditInfo, "id">;

export type UploadFileQueryParams = {
	folder: string;
	name?: string;
};

export type UploadFile = {
	file_path: string;
};
