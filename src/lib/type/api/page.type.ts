import type { AuditInfo, Param } from "@type/common.type";

export type PageQueryParams = {
	slug_contains?: string;
	slug_eq?: string;
	sort?: string;
} & Param;

export type PageBody = {
	slug: string;
	content: string;
};

export type Page = {
	slug: string;
	content: string;
	meta: Record<string, unknown>;
} & AuditInfo;
