import type { AuditInfo, Param } from "@type/common.type";
import type { Manager } from "./manager.type";
import type { Article } from "./article.type";

export type IssueQueryParams = {
	volume?: number;
	issue?: number;
	manager?: string;
	year?: number;
	manager__active_eq?: boolean; // stands for manager.active_eq
} & Param;

export type Issue = {
	volume: number;
	issue: number;
	year: number;
	month: number;
	manager?: Manager;
	articles: Article[];
} & AuditInfo;

export type PublishIssueBody = {
	volume: number;
	issue: number;
};
