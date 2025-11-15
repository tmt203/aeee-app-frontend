import type { FilterParams } from "@type/common.type";

export interface ArticleFilterParams {
	title_contains?: string;
	volume_eq?: FilterParams;
	issue_eq?: FilterParams;
}

export interface ArticleDataTable {
	id: string;
	title: string;
	volume: number;
	issue: number;
	doi: string;
	authors: string;
	pub_date: string;
}

export interface ArticleValidationSchema {
	title: string;
	doi: string;
	volume: number;
	issue: number;
	first_page: number;
	last_page: number;
	abstract: string;
	received_date: string;
	revised_date: string;
	accepted_date: string;
	published_date: string;
	pdf_path: string;
	authors: { first_name: string; last_name: string }[];
}
