import type { AuditInfo, Param } from "@type/common.type";

export type ManagerQueryParams = {
	volume?: number;
	issue?: number;
} & Param;

export type ManagerBody = {
	foreword: string;
	foreword_content: string;
	avatar_url: string;
	info_file_url: string;
	volume: number;
	issue: number;
	year: number;
	month: number;
	active: boolean;
};

export type Manager = ManagerBody & AuditInfo;

export type UploadFileQueryParams = {
	folder: string;
	name?: string;
};

export type UploadFile = {
	file_path: string;
};
