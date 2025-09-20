import type { AuditInfo, Param } from "@type/common.type";

export type AnnouncementQueryParams = {
	author_contains?: string;
	author_eq?: string;
	sort?: string;
	content_contains?: string;
} & Param;

export type Announcement = {
	author: string;
	title: string;
	content: string;
} & AuditInfo;

export type AnnouncementBody = {
	author: string;
	title: string;
	content: string;
};
