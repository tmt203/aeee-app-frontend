import type { FilterParams } from "@type/common.type";

export interface ArticleFilterParams {
	title_contains: string;
	volume_eq: FilterParams;
	issue_eq: FilterParams;
	active_eq: FilterParams;
}

export interface ArticleDataTable {
	id: string;
	title: string;
	volume: number;
	issue: number;
	doi: string;
	authors: string;
	pub_date: string;
	active: boolean;
}
