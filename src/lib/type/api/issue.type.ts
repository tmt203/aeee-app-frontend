import type { AuditInfo, Param } from "@type/common.type";
import type { Manager } from "./manager.type";
import type { Article } from "./article.type";

export type IssueQueryParams = {
	volume?: number;
	issue?: number;
	manager?: string;
	year?: number;
} & Param;

export type Issue = {
	volume: number;
	issue: number;
	year: number;
	manager?: Manager;
	articles: Article[];
} & AuditInfo;
