import type { FilterParams } from "@type/common.type";

export interface ArticleFilterParams {
	volume_eq: FilterParams;
	issue_eq: FilterParams;
	active_eq: FilterParams;
}

export interface VolumeIssueDataTable {
	index: number;
	volume: number;
	issue: number;
	foreword: string;
	id: string;
}
