import type { AuditInfo, Param } from "@type/common.type";

export type ManagerQueryParams = {
	volume?: number;
	issue?: number;
} & Param;

export type Manager = {
	foreword: string;
	avatar_url: string;
	info_file_url: string;
	volume: number;
	issue: number;
} & AuditInfo;
