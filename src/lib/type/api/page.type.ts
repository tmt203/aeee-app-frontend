import type { AuditInfo } from "@type/common.type";

export type PageQueryParams = {
	slug?: string;
};

export type PageBody = {
	slug: string;
	content: string;
};

export type Page = {
	slug: string;
	content: string;
	meta: Record<string, unknown>;
} & AuditInfo;
