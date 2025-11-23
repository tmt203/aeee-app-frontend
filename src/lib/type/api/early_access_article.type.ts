import type { AuditInfo, Param } from "@type/common.type";
import type { Author } from "./article.type";

export type EarlyAccessArticleQueryParams = {
	active_eq?: boolean;
	title_contains?: string;
} & Param;

export type EarlyAccessArticleBody = {
	title: string;
	authors: Author[];
	pdf_path: string;
	active: boolean;
};

export type EarlyAccessArticle = EarlyAccessArticleBody & AuditInfo;

export type UploadFileQueryParams = {
	folder: string;
	name?: string;
};

export type UploadFile = {
	file_path: string;
};
