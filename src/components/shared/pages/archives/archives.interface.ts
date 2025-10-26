export interface ArticleFilterParams {
	author_contains?: string;
	abstract_contains?: string;
	title_contains?: string;
	volume_eq?: number;
	issue_eq?: number;
	doi_contains?: string;
	pub_date: {
		day: number;
		month: number;
		year: number;
	};
}
