import type { FilterParams } from "@type/common.type";

export interface ArticleFilterParams {
	title_contains: string;
	active_eq: FilterParams;
}
